import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function WorkspacesRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "workspace_entry",
    currentPath: `/${locale}/w`,
  });

  return null;
}
