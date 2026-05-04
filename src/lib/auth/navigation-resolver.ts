import type { RoutePolicy } from "./route-policy.ts";
import type { SessionState } from "./session-state.ts";

export type NavigationDecision =
  | { type: "allow" }
  | { type: "redirect"; href: string };

export type ResolveNavigationInput = {
  locale: string;
  currentPath: string;
  policy: RoutePolicy;
  session: SessionState;
};

/**
 * Xác định hướng điều hướng theo policy route và trạng thái phiên hiện tại.
 */
export function resolveNavigation({
  locale,
  currentPath,
  policy,
  session,
}: ResolveNavigationInput): NavigationDecision {
  if (policy === "public") {
    return { type: "allow" };
  }

  if (policy === "guest_only") {
    if (session.kind === "guest") {
      return { type: "allow" };
    }

    if (session.kind === "authed_not_onboarded") {
      return redirect(`/${locale}/onboarding`);
    }

    return redirect(`/${locale}/w`);
  }

  if (policy === "onboarding") {
    if (session.kind === "guest") {
      return redirect(buildLoginHref(locale, currentPath));
    }

    if (session.kind === "authed_not_onboarded") {
      return { type: "allow" };
    }

    return redirect(`/${locale}/w`);
  }

  if (policy === "protected") {
    if (session.kind === "guest") {
      return redirect(buildLoginHref(locale, currentPath));
    }

    if (session.kind === "authed_not_onboarded") {
      return redirect(`/${locale}/onboarding`);
    }

    return { type: "allow" };
  }

  if (policy === "locale_entry") {
    if (session.kind === "guest") {
      return { type: "allow" };
    }

    if (session.kind === "authed_not_onboarded") {
      return redirect(`/${locale}/onboarding`);
    }
 
    return redirect(`/${locale}/w`);
  }

  if (session.kind === "guest") {
    return redirect(buildLoginHref(locale, currentPath));
  }

  if (session.kind === "authed_not_onboarded") {
    return redirect(`/${locale}/onboarding`);
  }

  return resolveWorkspaceEntry(locale, session);
}

function resolveWorkspaceEntry(
  locale: string,
  session: Extract<SessionState, { kind: "authed_onboarded" }>,
): NavigationDecision {
  const firstWorkspace = session.workspaces[0];

  if (!firstWorkspace) {
    return redirect(`/${locale}/onboarding`);
  }

  return redirect(`/${locale}/w/${firstWorkspace.slug}`);
}

function buildLoginHref(locale: string, currentPath: string): string {
  return `/${locale}/login?redirect=${encodeURIComponent(currentPath)}`;
}

function redirect(href: string): NavigationDecision {
  return { type: "redirect", href };
}
