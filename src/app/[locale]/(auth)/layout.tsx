import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "guest_only",
    currentPath: `/${locale}/login`,
  });

  return <AuthRouteFrame>{children}</AuthRouteFrame>;
}
