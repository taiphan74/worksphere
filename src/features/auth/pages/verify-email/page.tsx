"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AuthPage } from "@/features/auth/components/auth-page";
import { authService } from "@/features/auth/services/auth.service";
import { logAuthError } from "@/features/auth/utils/auth-error";
import { Link } from "@/i18n/navigation";
import { normalizeHttpError } from "@/lib/http/errors";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

type VerifyState = "loading" | "success" | "error";

function VerifyEmailContent() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyState>("loading");
  const [message, setMessage] = useState(t("verifyLoadingMessage"));
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    void (async () => {
      try {
        const response = await authService.verifyEmail(token);

        if (!isMounted) {
          return;
        }

        if (response.verified) {
          setStatus("success");
          setMessage(t("verifySuccessMessage"));
          // Redirect sau 1.5s để user thấy thông báo thành công
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setStatus("error");
          setMessage(t("verifyFailedMessage"));
        }
      } catch (error) {
        logAuthError("verify-email", error);

        if (!isMounted) {
          return;
        }

        const appError = normalizeHttpError(error);
        const code = appError.code || null;

        setStatus("error");
        setErrorCode(code);

        switch (code) {
          case "INVALID_TOKEN":
            setMessage(t("verifyInvalidToken"));
            break;
          case "INVALID_OR_EXPIRED_TOKEN":
            setMessage(t("verifyExpiredToken"));
            break;
          case "USER_NOT_FOUND":
            setMessage(t("verifyUserNotFound"));
            break;
          default:
            setMessage(t("verifySystemError"));
            break;
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [t, token]);

  const resolvedStatus = token ? status : "error";
  const resolvedMessage = token ? message : t("verifyInvalidToken");
  const resolvedErrorCode = token ? errorCode : "INVALID_TOKEN";

  return (
    <AuthPage
      title={t("verifyEmail")}
      subtitle={t("verifyEmailSubtitle")}
    >
      <div className="space-y-6">
        <div
          className={cn(
            "rounded-2xl border px-4 py-4 text-sm backdrop-blur-md",
            resolvedStatus === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
              : resolvedStatus === "loading"
                ? "border-white/20 bg-white/10 text-neutral-700"
                : "border-destructive/30 bg-destructive/10 text-destructive",
            glassEffect,
          )}
        >
          {resolvedMessage}
        </div>

        <div className="flex flex-col items-start gap-3">
          {resolvedErrorCode === "INVALID_OR_EXPIRED_TOKEN" ? (
            <Link
            href="/resend-verification"
            className="text-sm font-medium text-neutral-900 transition-colors hover:text-primary"
          >
            {t("goToResendVerification")}
          </Link>
          ) : null}

          <Button
            asChild
            variant="glass"
            className="h-11 rounded-xl px-5"
          >
            <Link href="/login">{t("login")}</Link>
          </Button>
        </div>
      </div>
    </AuthPage>
  );
}

export default function VerifyEmailFeaturePage() {
  const t = useTranslations("auth");

  return (
    <Suspense fallback={
      <AuthPage title={t("verifyEmail")} subtitle={t("loading")}>
        <div
          className={cn(
            "rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-sm text-neutral-700 backdrop-blur-md",
            glassEffect,
          )}
        >
          {t("verifyLoadingMessage")}
        </div>
      </AuthPage>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
