import { applyRoutePolicy } from "@/lib/auth/server-route-guards";

export default async function WorkspaceRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  await applyRoutePolicy({
    locale,
    policy: "protected",
    currentPath: `/${locale}/w`,
  });

  return children;
}
