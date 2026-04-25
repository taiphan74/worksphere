import OnboardingPage from "@/features/onboarding/pages/onboarding/page";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function OnboardingRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "onboarding",
    currentPath: `/${locale}/onboarding`,
  });

  return <OnboardingPage />;
}
