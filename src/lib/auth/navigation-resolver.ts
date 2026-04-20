import type { AuthUser } from "@/features/auth/types/auth.types";
import type { Workspace } from "@/features/workspace/types";

export type SessionState =
  | { type: "guest" }
  | { type: "authed_not_onboarded"; user: AuthUser }
  | { type: "authed_onboarded"; user: AuthUser; workspaces: Workspace[] };

export type RouteContext = {
  locale: string;
  isAuthRoute: boolean;
  isOnboardingRoute: boolean;
  isProtectedRoute: boolean;
};

export type NavigationDecision =
  | { type: "allow" }
  | { type: "redirect"; to: string };

export function resolveNavigationDecision(
  state: SessionState,
  route: RouteContext,
): NavigationDecision {
  if (state.type === "guest" && route.isProtectedRoute) {
    return { type: "redirect", to: `/${route.locale}` };
  }

  if (state.type === "authed_not_onboarded" && !route.isOnboardingRoute) {
    return { type: "redirect", to: `/${route.locale}/onboarding` };
  }

  if (state.type === "authed_onboarded" && (route.isAuthRoute || route.isOnboardingRoute)) {
    return { type: "redirect", to: `/${route.locale}/w` };
  }

  return { type: "allow" };
}

export function resolveWorkspaceEntry(
  locale: string,
  state: Extract<SessionState, { type: "authed_onboarded" }>,
): NavigationDecision {
  const firstWorkspace = state.workspaces[0];

  if (!firstWorkspace) {
    return { type: "redirect", to: `/${locale}/onboarding` };
  }

  return { type: "redirect", to: `/${locale}/w/${firstWorkspace.slug}` };
}
