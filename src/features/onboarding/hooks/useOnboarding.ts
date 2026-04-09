import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingService, UpdateProfileRequest } from "../services/onboarding.service";
import { useCreateWorkspace } from "@/features/workspace/hooks";
import { useOnboardingStore } from "../store/use-onboarding-store";
import { useRouter } from "@/i18n/navigation";
import { workspaceKeys } from "@/features/workspace/hooks";

export function useOnboarding() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { nextStep, reset } = useOnboardingStore();
  const createWorkspaceMutation = useCreateWorkspace();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => onboardingService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const handleProfileSubmit = async (data: { fullName: string }) => {
    await updateProfileMutation.mutateAsync({ full_name: data.fullName });
    nextStep();
  };

  const handleWorkspaceSubmit = async (data: { workspaceName: string }) => {
    const workspace = await createWorkspaceMutation.mutateAsync({ name: data.workspaceName });
    // Refetch lại danh sách workspace để cập nhật trạng thái onboarding
    await queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    nextStep();
    return workspace;
  };

  const finishOnboarding = () => {
    reset();
    router.push("/");
  };

  return {
    updateProfileMutation,
    createWorkspaceMutation,
    handleProfileSubmit,
    handleWorkspaceSubmit,
    finishOnboarding,
  };
}
