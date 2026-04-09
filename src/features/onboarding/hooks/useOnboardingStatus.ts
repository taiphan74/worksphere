import { useGetCurrentUser } from "@/features/auth/hooks/useGetCurrentUser";
import { useWorkspaces } from "@/features/workspace/hooks";

export function useOnboardingStatus() {
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();

  const isLoading = isLoadingUser || isLoadingWorkspaces;
  
  // Điều kiện hoàn tất: user có full name VÀ đã có ít nhất 1 workspace
  const isOnboardingComplete = Boolean(
    currentUser?.fullName && workspaces && workspaces.length > 0
  );

  return {
    currentUser,
    workspaces,
    isLoading,
    isOnboardingComplete,
  };
}
