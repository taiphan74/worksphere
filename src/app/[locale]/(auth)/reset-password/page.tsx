import ResetPasswordPage from "@/features/auth/pages/reset-password/page";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function ResetPasswordRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "guest_only",
    currentPath: `/${locale}/reset-password`,
  });

  return <ResetPasswordPage />;
}
