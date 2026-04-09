"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema, ProfileForm } from "../../schemas/onboarding.schema";
import { useOnboarding } from "../../hooks/useOnboarding";
import { useOnboardingStore } from "../../store/use-onboarding-store";
import { cn } from "@/lib/utils";

/**
 * Quản lý form nhập tên người dùng, validate bằng Zod và submit lên profile API.
 * @side-effect Cập nhật store để giữ fullName giữa các bước.
 */
export function StepProfile() {
  const t = useTranslations("onboarding");
  const { handleProfileSubmit, updateProfileMutation } = useOnboarding();
  const { fullName, setFullName } = useOnboardingStore();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: fullName,
    },
  });

  const onSubmit = async (values: ProfileForm) => {
    setFullName(values.fullName);
    await handleProfileSubmit(values);
  };

  const errors = form.formState.errors;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900">{t("profileTitle")}</h2>
        <p className="mt-2 text-neutral-600">{t("profileSubtitle")}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-neutral-800">
            {t("fullNameLabel")}
          </label>
          <Input
            id="fullName"
            placeholder={t("fullNamePlaceholder")}
            className={cn(
              "h-12 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground",
            )}
            aria-invalid={!!errors.fullName}
            {...form.register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="glass"
          className="h-12 w-full rounded-xl"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? t("saving") : t("continue")}
        </Button>
      </form>
    </div>
  );
}
