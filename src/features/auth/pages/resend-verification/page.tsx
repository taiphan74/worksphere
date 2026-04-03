"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthPage } from "@/features/auth/components/auth-page";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export default function ResendVerificationFeaturePage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const { resend, message, error, isPending, clearFeedback } =
    useResendVerification();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await resend(email);
  }

  return (
    <AuthPage
      title={t("resendVerification")}
      subtitle={t("resendVerificationSubtitle")}
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
          {t("resendVerificationAction")}
        </Button>

        <Link
          href="/login"
          className="block text-sm text-neutral-600 transition-colors hover:text-neutral-900"
        >
          {t("backToLogin")}
        </Link>
      </form>
    </AuthPage>
  );
}
