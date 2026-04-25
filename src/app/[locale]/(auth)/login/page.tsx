import LoginPage from "@/features/auth/pages/login/page";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function LoginRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "guest_only",
    currentPath: `/${locale}/login`,
  });

  return <LoginPage />;
}
