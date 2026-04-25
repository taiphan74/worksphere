import ForgotPasswordPage from "@/features/auth/pages/forgot-password/page";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function ForgotPasswordRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "guest_only",
    currentPath: `/${locale}/forgot-password`,
  });

  return <ForgotPasswordPage />;
}
