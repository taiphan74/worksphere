import { WorkspaceHeader } from "@/components/workspace/workspace-header";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8">
        <WorkspaceHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
