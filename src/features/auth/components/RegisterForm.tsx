"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useRegisterMutation } from "@/features/auth/hooks/useRegisterMutation";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

/** Màn hình hiển thị sau khi đăng ký thành công. */
function RegisterSuccess({
  email,
  verificationEmailSent,
}: {
  email: string;
  verificationEmailSent: boolean;
}) {
  const t = useTranslations("auth");
  const {
    resend,
    message: resendMessage,
    error: resendError,
    isPending: isResending,
  } = useResendVerification();

  async function handleResend() {
    await resend(email);
  }

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div
        className={cn(
          "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-700 backdrop-blur-md",
          glassEffect,
        )}
      >
        <p className="font-medium">{t("registerSuccessTitle")}</p>
        <p className="mt-1">
          {verificationEmailSent
            ? t("registerSuccessWithEmail", { email })
            : t("registerSuccessWithoutEmail")}
        </p>
      </div>

      {/* Resend feedback */}
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

      {/* Actions */}
      <div className="flex flex-col items-start gap-3">
        <ResendVerificationButton
          onClick={handleResend}
          disabled={isResending}
        />
        <Link
          href="/login"
          className="text-sm font-medium text-neutral-900 transition-colors hover:text-primary"
        >
          {t("goToLogin")}
        </Link>
      </div>
    </div>
  );
}

/** Form đăng ký — chỉ lo UI, logic nằm trong useRegisterMutation. */
export function RegisterForm() {
  const t = useTranslations("auth");

  const { form, mutation, handleSubmit } = useRegisterMutation();

  const errors = form.formState.errors;
  const rootError = errors.root?.message;

  // ─── Render success state ────────────────────────────────────────
  if (mutation.isSuccess && mutation.data?.user?.email) {
    return (
      <RegisterSuccess
        email={mutation.data.user.email}
        verificationEmailSent={mutation.data.verificationEmailSent !== false}
      />
    );
  }

  // ─── Render form ─────────────────────────────────────────────────
  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Global / root error */}
      {rootError && (
        <div
          role="alert"
          className={cn(
            "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md",
            glassEffect,
          )}
        >
          {rootError}
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
              onChange: () => form.clearErrors("email"),
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
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            className={cn(
              "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
              glassEffect,
            )}
            aria-invalid={!!errors.password}
            {...form.register("password", {
              onChange: () => form.clearErrors("password"),
            })}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Link to login */}
        <p className="text-sm text-neutral-700/80">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-neutral-900 transition-colors hover:text-primary"
          >
            {t("login")}
          </Link>
        </p>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="glass"
        className="h-12 w-full rounded-xl"
        disabled={mutation.isPending}
      >
        {t("registerAction")}
      </Button>

      {/* Social login */}
      <SocialLogin label={t("registerWithGoogle")} />
    </form>
  );
}
