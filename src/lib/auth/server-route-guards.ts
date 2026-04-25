import { redirect } from "next/navigation";

import { resolveNavigation } from "@/lib/auth/navigation-resolver";
import type { RoutePolicy } from "@/lib/auth/route-policy";
import { resolveSessionState } from "@/lib/auth/session-resolver";

/**
 * Áp policy điều hướng cho server route và redirect ngay khi policy không cho phép render tiếp.
 */
export async function applyRoutePolicy({
  locale,
  policy,
  currentPath,
}: {
  locale: string;
  policy: RoutePolicy;
  currentPath: string;
}) {
  const session = await resolveSessionState();
  const result = resolveNavigation({
    locale,
    policy,
    currentPath,
    session,
  });

  if (result.type === "redirect") {
    redirect(result.href);
  }

  return session;
}
