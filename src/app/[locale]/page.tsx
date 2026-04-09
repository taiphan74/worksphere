import { redirect } from "next/navigation";
import { getLandingAuthState } from "@/lib/auth/landing-auth-checker";
import { AuthFlashNotice } from "@/components/auth/auth-flash-notice";
import { LandingHeader } from "@/components/layout/landing-header";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { workspaceBackgroundGradient } from "@/styles/glass";

async function LandingRedirect({ locale }: { locale: string }) {
  const auth = await getLandingAuthState();

  if (auth.status === "not_authenticated") {
    return null;
  }

  // Đã có user → kiểm tra đã onboard chưa
  const hasName = !!auth.user.fullName;
  const hasWorkspace = auth.workspaces.length > 0;

  if (hasName && hasWorkspace) {
    redirect(`/${locale}/w/${auth.workspaces[0].slug}`);
  }

  if (hasName && !hasWorkspace) {
    redirect(`/${locale}/onboarding`);
  }

  // Không có name → cần onboarding
  redirect(`/${locale}/onboarding`);
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
