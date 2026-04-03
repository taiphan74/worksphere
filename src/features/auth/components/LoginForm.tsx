"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export function LoginForm() {
  const router = useRouter();
  const { form, errors, globalError, errorCode, updateField, isPending, login } =
    useAuth();
  const {
    resend,
    message: resendMessage,
    error: resendError,
    isPending: isResending,
    clearFeedback,
  } = useResendVerification();
  const canResendVerification =
    errorCode === "EMAIL_NOT_VERIFIED" && form.email.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await login();

    if (response) {
      router.push("/");
    }
  }

  async function handleResendVerification() {
    await resend(form.email);
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
          <p>{globalError}</p>
          {canResendVerification ? (
            <ResendVerificationButton
              onClick={handleResendVerification}
              disabled={isResending}
            />
          ) : null}
        </div>
      ) : null}

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

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-800">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
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
            Mật khẩu
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Mật khẩu"
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
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link
          href="/forgot-password"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          Quên mật khẩu?
        </Link>
        <Link
          href="/register"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          Đăng ký
        </Link>
      </div>

      <Button
        type="submit"
        variant="glass"
        className="h-12 w-full rounded-xl border-white/30 bg-black/70 text-sm font-semibold text-white shadow-[0_20px_46px_rgba(42,47,60,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] before:from-white/40 before:via-white/18 before:to-transparent after:opacity-30 hover:bg-black/60"
        disabled={isPending}
      >
        Đăng nhập
      </Button>

      <SocialLogin />
    </form>
  );
}
