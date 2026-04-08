import { checkAuth } from "@/lib/auth/auth-checker";
import { isUserOnboarded } from "@/lib/auth/server-onboarding";
import { redirect } from "next/navigation";
import {
  TaskCreatePanel,
  WorkspaceCommandPalette,
  WorkspaceHeader,
  WorkspaceSidebar,
} from "@/features/workspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default async function WorkspaceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; workspaceSlug: string }>;
}>) {
  const { locale, workspaceSlug } = await params;

  // Second layer authentication check
  await checkAuth(true, locale); // Verify with backend and pass locale for redirect

  // Onboarding check
  const onboarded = await isUserOnboarded();
  if (!onboarded) {
    redirect(`/${locale}/onboarding`);
  }

  return (
    <SidebarProvider defaultOpen className="flex-col">
      <div
        className={cn(
          "flex h-screen flex-col overflow-hidden",
          "bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)]",
        )}
      >
        <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 xl:px-6">
          <WorkspaceHeader />
        </div>

        <WorkspaceCommandPalette workspaceSlug={workspaceSlug} />
        <TaskCreatePanel />
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 sm:gap-4 sm:px-5 sm:pb-5 xl:px-6 xl:pb-6">
          <div className="flex min-h-0 flex-1 items-stretch gap-3">
            <WorkspaceSidebar workspaceSlug={workspaceSlug} />
            <SidebarInset className="min-h-0 self-stretch">
              <div className="flex h-full min-h-0 flex-col rounded-[26px] border border-white/30 bg-white/10 px-4 py-4 shadow-[0_20px_48px_rgba(86,110,148,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl sm:px-5 sm:py-5">
                <main className="min-h-0 flex-1">{children}</main>
              </div>
            </SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
