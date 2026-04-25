import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function getLocaleFromPathname(pathname: string) {
  return routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function isGuestProtectedPath(pathname: string, locale: string) {
  return pathname === `/${locale}/onboarding` || pathname.startsWith(`/${locale}/w`);
}

function buildLoginRedirectUrl(request: NextRequest, locale: string) {
  const redirectTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL(`/${locale}/login`, request.url);

  loginUrl.searchParams.set("redirect", redirectTarget);

  return loginUrl;
}

export default function proxy(request: NextRequest) {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  if (locale && isGuestProtectedPath(request.nextUrl.pathname, locale)) {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.redirect(buildLoginRedirectUrl(request, locale));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(vi|en)", "/(vi|en)/onboarding", "/(vi|en)/w/:path*"],
};
