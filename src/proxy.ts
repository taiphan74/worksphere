import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

// Define route types
const isPublicRoute = (path: string): boolean => {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/resend-verification',
    '/auth'
  ];

  return publicRoutes.some(route => path.startsWith(route)) ||
         path === '/' ||
         path === '/vi' ||
         path === '/en';
};

const isAuthRoute = (path: string): boolean => {
  // Routes related to authentication
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/auth'];
  return authRoutes.some(route => path.startsWith(route));
};

const isWorkspaceRoute = (path: string): boolean => {
  // Routes that require authentication
  return path.startsWith('/w');
};

const isOnboardingRoute = (path: string): boolean => {
  return path.startsWith('/onboarding');
};

// Extract the basePath without locale prefix
const getBasePath = (pathname: string, locale: string): string => {
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.substring(locale.length + 2); // +2 for '/{locale}/'
  }
  // If no locale prefix, return the pathname as is
  return pathname;
};

// Main middleware function
const createAuthMiddleware = () => {
  return async (request: NextRequest) => {
    // Step 1: Run next-intl middleware first
    const intlResponse = createIntlMiddleware(routing)(request);

    // Get the pathname without locale prefix
    const locale = request.nextUrl.pathname.split('/')[1];
    const supportedLocales = routing.locales as readonly string[];
    const hasLocalePrefix = supportedLocales.includes(locale);

    const basePath = hasLocalePrefix
      ? getBasePath(request.nextUrl.pathname, locale)
      : request.nextUrl.pathname;

    // Step 2: Determine route type
    const isPublic = isPublicRoute(basePath);
    const isAuth = isAuthRoute(basePath);
    const isWorkspace = isWorkspaceRoute(basePath);
    const isOnboarding = isOnboardingRoute(basePath);

    // Step 3: Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    // Step 4: Apply business rules
    if (!accessToken && (isWorkspace || isOnboarding || (!isPublic && !isAuth))) {
      // Redirect to login if no token and trying to access protected routes
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (accessToken && isAuth) {
      // Redirect to landing page if already logged in and trying to access auth routes
      // Landing page will handle further routing (workspace or onboarding)
      const homeUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Step 5: Return next response if all checks pass
    return intlResponse;
  };
};

export default createAuthMiddleware();

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en)/:path*"],
};
