"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthPage } from "@/features/auth/components/auth-page";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export default function ResendVerificationFeaturePage() {
  const [email, setEmail] = useState("");
  const { resend, message, error, isPending, clearFeedback } =
    useResendVerification();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await resend(email);
  }

  return (
    <AuthPage
      title="Gửi lại email xác thực"
      subtitle="Nhập email để nhận lại liên kết xác thực tài khoản."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message ? (
          <div
            className={cn(
              "rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 backdrop-blur-md",
              glassEffect,
            )}
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className={cn(
              "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md",
              glassEffect,
            )}
          >
            {error}
          </div>
        ) : null}

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
            value={email}
            onChange={(event) => {
              clearFeedback();
              setEmail(event.target.value);
            }}
          />
        </div>

        <Button
          type="submit"
          variant="glass"
          className="h-12 w-full rounded-xl"
          disabled={isPending}
        >
          Gửi lại email xác thực
        </Button>

        <Link
          href="/login"
          className="block text-sm text-neutral-600 transition-colors hover:text-neutral-900"
        >
          Quay lại đăng nhập
        </Link>
      </form>
    </AuthPage>
  );
}
