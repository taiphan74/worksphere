"use client";

import { useState, useTransition } from "react";

import { authService } from "@/features/auth/services/auth.service";
import { logAuthError } from "@/features/auth/utils/auth-error";
import { normalizeHttpError } from "@/lib/http/errors";

const DEFAULT_SUCCESS_MESSAGE =
  "Nếu email tồn tại, chúng tôi đã gửi email xác thực.";

export function useResendVerification() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resend(email: string) {
    setMessage(null);
    setError(null);

    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const response = await authService.resendVerification(email);

          setMessage(response.message || DEFAULT_SUCCESS_MESSAGE);
          resolve(true);
        } catch (unknownError) {
          logAuthError("resend-verification", unknownError);

          const appError = normalizeHttpError(unknownError);
          const retryAfter = appError.details?.retry_after_seconds;
          const nextError = retryAfter
            ? `Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau ${retryAfter}s.`
            : appError.message;

          setError(nextError);
          resolve(false);
        }
      });
    });
  }

  function clearFeedback() {
    setMessage(null);
    setError(null);
  }

  return {
    resend,
    message,
    error,
    isPending,
    clearFeedback,
  };
}
