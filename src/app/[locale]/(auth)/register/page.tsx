import RegisterPage from "@/features/auth/pages/register/page";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function RegisterRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "guest_only",
    currentPath: `/${locale}/register`,
  });

  return <RegisterPage />;
}
