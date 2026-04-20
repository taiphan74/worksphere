import { redirect } from "next/navigation";

import { resolveWorkspaceEntry } from "@/lib/auth/navigation-resolver";
import { resolveSessionState } from "@/lib/auth/session-resolver";

export default async function WorkspacesRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const state = await resolveSessionState();

  if (state.type === "guest") {
    redirect(`/${locale}`);
  }

  if (state.type === "authed_not_onboarded") {
    redirect(`/${locale}/onboarding`);
  }

  const workspaceDecision = resolveWorkspaceEntry(locale, state);
  if (workspaceDecision.type === "redirect") {
    redirect(workspaceDecision.to);
  }
}
