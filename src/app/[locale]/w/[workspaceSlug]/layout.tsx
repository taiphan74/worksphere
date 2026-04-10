import { Suspense } from "react";
import { checkAuth } from "@/lib/auth/auth-checker";
import { isUserOnboarded } from "@/lib/auth/server-onboarding";
import { notFound, redirect } from "next/navigation";
import {
  TaskCreatePanel,
  WorkspaceCommandPalette,
  WorkspaceHeader,
  WorkspaceSidebar,
} from "@/features/workspace";
import { WorkspaceContentSkeleton, WorkspaceHeaderSkeleton, WorkspaceSidebarSkeleton } from "@/components/loading/workspace-skeletons";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { workspaceBackgroundGradient } from "@/styles/glass";
import { workspaceService } from "@/features/workspace/services/workspace-service";

export default async function WorkspaceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; workspaceSlug: string }>;
}>) {
  const { locale, workspaceSlug } = await params;

  await checkAuth(true, locale);

  const onboarded = await isUserOnboarded();
  if (!onboarded) {
    redirect(`/${locale}/onboarding`);
  }

  // Validate workspace slug
  try {
    const workspace = await workspaceService.getWorkspaceBySlug(workspaceSlug);
    if (!workspace) {
      notFound();
    }
  } catch (error: unknown) {
    // If API returns 404 or 403, show 404 page
    const status = (error as { status?: number })?.status;
    if (status === 404 || status === 403) {
      notFound();
    }

    // For other errors, notFound is the safest for invalid slugs
    notFound();
  }

  return (
    <SidebarProvider defaultOpen className="flex-col">
      <div
        className={cn(
          "flex h-screen flex-col overflow-hidden",
          workspaceBackgroundGradient,
        )}
      >
        <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 xl:px-6">
          <Suspense fallback={<WorkspaceHeaderSkeleton />}>
            <WorkspaceHeader />
          </Suspense>
        </div>

        <WorkspaceCommandPalette workspaceSlug={workspaceSlug} />
        <TaskCreatePanel />
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 sm:gap-4 sm:px-5 sm:pb-5 xl:px-6 xl:pb-6">
          <div className="flex min-h-0 flex-1 items-stretch gap-3">
            <Suspense fallback={<WorkspaceSidebarSkeleton />}>
              <WorkspaceSidebar workspaceSlug={workspaceSlug} />
            </Suspense>
            <SidebarInset className="min-h-0 self-stretch">
              <div className="flex h-full min-h-0 flex-col rounded-[26px] border border-white/30 bg-white/10 px-4 py-4 shadow-[0_20px_48px_rgba(86,110,148,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl sm:px-5 sm:py-5">
                <main className="min-h-0 flex-1">
                  <Suspense fallback={<WorkspaceContentSkeleton />}>
                    {children}
                  </Suspense>
                </main>
              </div>
            </SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
