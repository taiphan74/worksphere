import { AuthFlashNotice } from "@/components/auth/auth-flash-notice";
import { LandingHeader } from "@/components/layout/landing-header";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";
import { workspaceBackgroundGradient } from "@/styles/glass";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "locale_entry",
    currentPath: `/${locale}`,
  });

  return (
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
  );
}
