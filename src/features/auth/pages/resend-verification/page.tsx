"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";

export default function ResendVerificationFeaturePage() {
  const [email, setEmail] = useState("");
  const { resend, message, error, isPending, clearFeedback } =
    useResendVerification();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await resend(email);
  }

  return (
    <AuthShell
      title="Gửi lại email xác thực"
      subtitle="Nhập email để nhận lại liên kết xác thực tài khoản."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

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
            value={email}
            onChange={(event) => {
              clearFeedback();
              setEmail(event.target.value);
            }}
          />
        </div>

        <Button type="submit" className="h-12 w-full rounded-xl" disabled={isPending}>
          Gửi lại email xác thực
        </Button>

        <Link
          href="/login"
          className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Quay lại đăng nhập
        </Link>
      </form>
    </AuthShell>
  );
}
