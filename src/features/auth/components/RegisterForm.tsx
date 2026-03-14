"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";

export function RegisterForm() {
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
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-700">
          <p className="font-medium">Đăng ký thành công.</p>
          <p className="mt-1">
            {verificationWasSent
              ? `Đã gửi email xác thực đến ${response.user.email}. Vui lòng kiểm tra hộp thư.`
              : "Đăng ký thành công nhưng chưa gửi được email xác thực. Vui lòng thử gửi lại."}
          </p>
        </div>

        {resendMessage ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            {resendMessage}
          </div>
        ) : null}

        {resendError ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
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
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Đi tới đăng nhập
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
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {globalError}
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            className="h-12 rounded-xl bg-background"
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
            className="text-sm font-medium text-foreground"
          >
            Mật khẩu
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Mật khẩu"
            className="bg-background"
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

        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Đăng nhập
          </Link>
        </p>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl"
        disabled={isPending}
      >
        Đăng ký
      </Button>

      <SocialLogin label="Đăng ký với Google" />
    </form>
  );
}
