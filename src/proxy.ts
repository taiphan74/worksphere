import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

import { routing } from "./i18n/routing";

export default function proxy(request: NextRequest) {
  return createIntlMiddleware(routing)(request);
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*"],
};
