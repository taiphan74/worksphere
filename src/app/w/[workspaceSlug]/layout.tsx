import { WorkspaceCommandPalette, WorkspaceHeader, WorkspaceSidebar } from "@/features/workspace";
import { TaskCreatePanel } from "@/features/task";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function WorkspaceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}>) {
  const { workspaceSlug } = await params;

  return (
    <SidebarProvider defaultOpen className="flex-col bg-background">
      <div className="px-4 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3 xl:px-6">
        <WorkspaceHeader />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 sm:gap-4 sm:px-5 sm:pb-5 xl:px-6 xl:pb-6">
        <div className="flex min-h-0 flex-1 items-stretch gap-3">
          <WorkspaceSidebar workspaceSlug={workspaceSlug} />
          <SidebarInset className="min-h-0 self-stretch">
            <div className="flex h-full min-h-0 flex-col rounded-[26px] border border-border bg-background px-4 py-4 shadow-xs sm:px-5 sm:py-5">
              <WorkspaceCommandPalette workspaceSlug={workspaceSlug} />
              <TaskCreatePanel />
              <main className="min-h-0 flex-1">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
