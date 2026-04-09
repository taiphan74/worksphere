import { Suspense } from "react";
import { WorkspaceMembersSkeleton } from "@/components/loading/workspace-skeletons";

export default function WorkspaceMembersPage() {
  return (
    <Suspense fallback={<WorkspaceMembersSkeleton />}>
      null
    </Suspense>
  );
}
