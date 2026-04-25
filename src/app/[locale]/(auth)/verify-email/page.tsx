import VerifyEmailPage from "@/features/auth/pages/verify-email/page";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function VerifyEmailRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "guest_only",
    currentPath: `/${locale}/verify-email`,
  });

  return <VerifyEmailPage />;
}
