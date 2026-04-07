"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();

  const { form, mutation, handleSubmit } = useLoginMutation();

  const {
    resend,
    message: resendMessage,
    error: resendError,
    isPending: isResending,
    clearFeedback,
  } = useResendVerification();

  const errors = form.formState.errors;
  const rootError = errors.root;
  const canResendVerification =
    rootError?.type === "EMAIL_NOT_VERIFIED" && form.getValues("email").trim().length > 0;

  async function onFormSubmit(values: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const response = await handleSubmit(values);
      if (response) {
        router.push("/");
      }
    } catch {
      // Error handled by mutation onError
    }
  }

  async function handleResendVerification() {
    await resend(form.getValues("email"));
  }

  return (
    <form
      onSubmit={form.handleSubmit(onFormSubmit)}
      className="space-y-6"
      noValidate
    >
      {rootError && (
        <div
          role="alert"
          className={cn(
            "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md",
            glassEffect,
          )}
        >
          <p>{rootError.message}</p>
          {canResendVerification ? (
            <ResendVerificationButton
              onClick={handleResendVerification}
              disabled={isResending}
            />
          ) : null}
        </div>
      )}

      {resendMessage && (
        <div
          className={cn(
            "rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 backdrop-blur-md",
            glassEffect,
          )}
        >
          {resendMessage}
        </div>
      )}

      {resendError && (
        <div
          role="alert"
          className={cn(
            "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md",
            glassEffect,
          )}
        >
          {resendError}
        </div>
      )}

      <div className="space-y-4">
        {/* Email field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-800"
          >
            {t("emailLabel")}
          </label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={cn(
              "h-12 rounded-xl border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
              glassEffect,
            )}
            aria-invalid={!!errors.email}
            {...form.register("email", {
              onChange: () => {
                clearFeedback();
                form.clearErrors("email");
                if (rootError) form.clearErrors("root");
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-neutral-800"
          >
            {t("passwordLabel")}
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            className={cn(
              "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
              glassEffect,
            )}
            aria-invalid={!!errors.password}
            {...form.register("password", {
              onChange: () => {
                clearFeedback();
                form.clearErrors("password");
                if (rootError) form.clearErrors("root");
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link
          href="/forgot-password"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          {t("forgotPasswordLink")}
        </Link>
        <Link
          href="/register"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          {t("registerAction")}
        </Link>
      </div>

      <Button
        type="submit"
        variant="glass"
        className="h-12 w-full rounded-xl"
        disabled={mutation.isPending}
      >
        {t("login")}
      </Button>

      <SocialLogin />
    </form>
  );
}

