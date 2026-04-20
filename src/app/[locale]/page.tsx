import { redirect } from "next/navigation";

import { AuthFlashNotice } from "@/components/auth/auth-flash-notice";
import { LandingHeader } from "@/components/layout/landing-header";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { resolveNavigationDecision, resolveWorkspaceEntry } from "@/lib/auth/navigation-resolver";
import { resolveSessionState } from "@/lib/auth/session-resolver";
import { workspaceBackgroundGradient } from "@/styles/glass";

async function LandingRedirect({ locale }: { locale: string }) {
  const state = await resolveSessionState();

  const decision = resolveNavigationDecision(state, {
    locale,
    isAuthRoute: false,
    isOnboardingRoute: false,
    isProtectedRoute: false,
  });

  if (decision.type === "redirect") {
    redirect(decision.to);
  }

  if (state.type === "authed_onboarded") {
    const workspaceDecision = resolveWorkspaceEntry(locale, state);
    if (workspaceDecision.type === "redirect") {
      redirect(workspaceDecision.to);
    }
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <LandingRedirect locale={locale} />
      <main className={`relative min-h-screen overflow-hidden ${workspaceBackgroundGradient}`}>
        <FogOverlay />
        <LandingHeader />
        <section className="relative z-10 min-h-screen px-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center min-h-screen">
            <AuthFlashNotice />
            <HeroHeadline />
          </div>
        </section>
      </main>
    </>
  );
}
