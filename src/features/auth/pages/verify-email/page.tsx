"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { authService } from "@/features/auth/services/auth.service";
import { logAuthError } from "@/features/auth/utils/auth-error";
import { normalizeHttpError } from "@/lib/http/errors";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailFeaturePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Đang xác thực email của bạn...");
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
          setMessage("Xác thực email thành công! Bạn có thể đăng nhập.");
        } else {
          setStatus("error");
          setMessage("Không thể xác thực email. Vui lòng thử lại.");
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
            setMessage("Link xác thực không hợp lệ.");
            break;
          case "INVALID_OR_EXPIRED_TOKEN":
            setMessage(
              "Link xác thực đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại.",
            );
            break;
          case "USER_NOT_FOUND":
            setMessage("Không tìm thấy tài khoản.");
            break;
          default:
            setMessage("Lỗi hệ thống, vui lòng thử lại.");
            break;
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const resolvedStatus = token ? status : "error";
  const resolvedMessage = token ? message : "Link xác thực không hợp lệ.";
  const resolvedErrorCode = token ? errorCode : "INVALID_TOKEN";

  return (
    <AuthShell
      title="Xác thực email"
      subtitle="WorkSphere đang kiểm tra liên kết xác thực của bạn."
    >
      <div className="space-y-6">
        <div
          className={`rounded-2xl border px-4 py-4 text-sm ${
            resolvedStatus === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
              : resolvedStatus === "loading"
                ? "border-border bg-muted/40 text-muted-foreground"
                : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {resolvedMessage}
        </div>

        <div className="flex flex-col items-start gap-3">
          {resolvedErrorCode === "INVALID_OR_EXPIRED_TOKEN" ? (
            <Link
              href="/resend-verification"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Đi tới gửi lại email xác thực
            </Link>
          ) : null}

          <Button asChild className="h-11 rounded-xl px-5">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
