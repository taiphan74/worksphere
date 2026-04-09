import { redirect } from "next/navigation";
import { getLandingAuthState } from "@/lib/auth/landing-auth-checker";
import { isUserOnboarded } from "@/lib/auth/server-onboarding";
import OnboardingPage from "@/features/onboarding/pages/onboarding/page";

async function OnboardingGuard({ locale }: { locale: string }): Promise<React.ReactNode> {
  const auth = await getLandingAuthState();

  if (auth.status === "not_authenticated") {
    redirect(`/${locale}/login`);
  }

  // Đã onboard xong → redirect vào workspace đầu tiên
  const onboarded = await isUserOnboarded();
  if (onboarded && auth.workspaces.length > 0) {
    redirect(`/${locale}/w/${auth.workspaces[0].slug}`);
  }

  return null;
}

export default async function OnboardingRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <OnboardingGuard locale={locale} />
      <OnboardingPage />
    </>
  );
}
