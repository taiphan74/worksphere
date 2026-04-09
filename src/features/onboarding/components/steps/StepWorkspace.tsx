"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { workspaceSchema, WorkspaceForm } from "../../schemas/onboarding.schema";
import { useOnboarding } from "../../hooks/useOnboarding";
import { useOnboardingStore } from "../../store/use-onboarding-store";
import { cn } from "@/lib/utils";

/**
 * Quản lý form tạo workspace, gửi yêu cầu lên API và cập nhật store sau khi thành công.
 * @side-effect Cập nhật workspaceName để giữ lại giữa các lần quay lại step.
 */
export function StepWorkspace() {
  const t = useTranslations("onboarding");
  const { handleWorkspaceSubmit, createWorkspaceMutation } = useOnboarding();
  const { workspaceName, setWorkspaceName } = useOnboardingStore();

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: workspaceName,
    },
  });

  const onSubmit = async (values: WorkspaceForm) => {
    setWorkspaceName(values.workspaceName);
    await handleWorkspaceSubmit(values);
  };

  const errors = form.formState.errors;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900">{t("workspaceTitle")}</h2>
        <p className="mt-2 text-neutral-600">{t("workspaceSubtitle")}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="workspaceName" className="text-sm font-medium text-neutral-800">
            {t("workspaceNameLabel")}
          </label>
          <Input
            id="workspaceName"
            placeholder={t("workspaceNamePlaceholder")}
            className={cn(
              "h-12 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground",
            )}
            aria-invalid={!!errors.workspaceName}
            {...form.register("workspaceName")}
          />
          {errors.workspaceName && (
            <p className="text-sm text-destructive">{errors.workspaceName.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="glass"
          className="h-12 w-full rounded-xl"
          disabled={createWorkspaceMutation.isPending}
        >
          {createWorkspaceMutation.isPending ? t("creating") : t("continue")}
        </Button>
      </form>
    </div>
  );
}
