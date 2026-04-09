import { Suspense } from "react";
import WorkspaceTasksPageInner from "@/features/task/pages/tasks-page";
import { WorkspaceContentSkeleton } from "@/components/loading/workspace-skeletons";

export default function WorkspaceTasksPage() {
  return (
    <Suspense fallback={<WorkspaceContentSkeleton />}>
      <WorkspaceTasksPageInner />
    </Suspense>
  );
}
