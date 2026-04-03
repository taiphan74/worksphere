"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export function RegisterForm() {
  const t = useTranslations("auth");
  const { form, errors, globalError, isPending, updateField, register, response } =
    useRegisterForm();
  const {
    resend,
    message: resendMessage,
    error: resendError,
    isPending: isResending,
    clearFeedback,
  } = useResendVerification();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await register();
  }

  async function handleResendVerification() {
    await resend(response?.user?.email || form.email);
  }

  if (response?.user?.email) {
    const verificationWasSent = response.verificationEmailSent !== false;

    return (
      <div className="space-y-6">
        <div
          className={cn(
            "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-700 backdrop-blur-md",
            glassEffect,
          )}
        >
          <p className="font-medium">{t("registerSuccessTitle")}</p>
          <p className="mt-1">
            {verificationWasSent
              ? t("registerSuccessWithEmail", { email: response.user.email })
              : t("registerSuccessWithoutEmail")}
          </p>
        </div>

        {resendMessage ? (
          <div
            className={cn(
              "rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 backdrop-blur-md",
              glassEffect,
            )}
          >
            {resendMessage}
          </div>
        ) : null}

        {resendError ? (
          <div
            role="alert"
            className={cn(
              "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md",
              glassEffect,
            )}
          >
            {resendError}
          </div>
        ) : null}

        <div className="flex flex-col items-start gap-3">
          <ResendVerificationButton
            onClick={handleResendVerification}
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {globalError ? (
        <div
          role="alert"
          className={cn(
            "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md",
            glassEffect,
          )}
        >
          {globalError}
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-800">
            {t("emailLabel")}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={cn(
              "h-12 rounded-xl border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
              glassEffect,
            )}
            value={form.email}
            onChange={(event) => {
              clearFeedback();
              updateField("email", event.target.value);
            }}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-neutral-800"
          >
            {t("passwordLabel")}
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            className={cn(
              "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
              glassEffect,
            )}
            value={form.password}
            onChange={(event) => {
              clearFeedback();
              updateField("password", event.target.value);
            }}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password}</p>
          ) : null}
        </div>

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

      <Button
        type="submit"
        variant="glass"
        className="h-12 w-full rounded-xl"
        disabled={isPending}
      >
        {t("registerAction")}
      </Button>

      <SocialLogin label={t("registerWithGoogle")} />
    </form>
  );
}
