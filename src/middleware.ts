import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function getLocaleFromPathname(pathname: string) {
  return routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function isProtectedPath(pathname: string, locale: string) {
  return pathname === `/${locale}/onboarding` || pathname.startsWith(`/${locale}/w`);
}

function isJwtExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function buildLoginRedirectUrl(request: NextRequest, locale: string) {
  const redirectTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL(`/${locale}/login`, request.url);

  loginUrl.searchParams.set("redirect", redirectTarget);

  return loginUrl;
}

function getSetCookieHeaders(source: Response) {
  if (typeof source.headers.getSetCookie === "function") {
    return source.headers.getSetCookie();
  }

  const setCookieHeader = source.headers.get("set-cookie");

  return setCookieHeader ? [setCookieHeader] : [];
}

function forwardSetCookies(target: NextResponse, source: Response) {
  for (const cookie of getSetCookieHeaders(source)) {
    target.headers.append("Set-Cookie", cookie);
  }

  return target;
}

type RefreshResult =
  | { type: "ok"; response: Response }
  | { type: "failed" }
  | { type: "missing_api_base_url" };

async function refreshTokens(request: NextRequest): Promise<RefreshResult> {
  if (!apiBaseUrl) {
    return { type: "missing_api_base_url" };
  }

  const response = await fetch(`${apiBaseUrl}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: request.cookies.toString(),
    },
  });

  if (!response.ok) {
    return { type: "failed" };
  }

  return { type: "ok", response };
}

export async function middleware(request: NextRequest) {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  if (!locale || !isProtectedPath(request.nextUrl.pathname, locale)) {
    return intlMiddleware(request);
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(buildLoginRedirectUrl(request, locale));
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const accessTokenExpired = accessToken ? isJwtExpired(accessToken) : true;

  if (accessToken && !accessTokenExpired) {
    return intlMiddleware(request);
  }

  const refreshResult = await refreshTokens(request);

  if (refreshResult.type !== "ok") {
    return NextResponse.redirect(buildLoginRedirectUrl(request, locale));
  }

  const redirectResponse = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));

  return forwardSetCookies(redirectResponse, refreshResult.response);
}

export const config = {
  matcher: ["/", "/(vi|en)", "/(vi|en)/onboarding", "/(vi|en)/w/:path*"],
};
