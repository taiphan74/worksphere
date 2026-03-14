"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useGoogleLoginReady } from "@/features/auth/hooks/useGoogleLoginReady";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { authService } from "@/features/auth/services/auth.service";
import { logAuthError } from "@/features/auth/utils/auth-error";
import { normalizeHttpError } from "@/lib/http/errors";

const AUTH_FLASH_STORAGE_KEY = "worksphere.auth_flash";

type UseGoogleLoginOptions = {
  label: string;
};

type GoogleJwtPayload = {
  email: string;
  name?: string;
  picture?: string;
};

function decodeGoogleCredential(credential: string): GoogleJwtPayload {
  const [, payload] = credential.split(".");

  if (!payload) {
    throw new Error("Google credential khong hop le");
  }

  const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decodedPayload = window.atob(normalizedPayload);

  return JSON.parse(decodedPayload) as GoogleJwtPayload;
}

export function useGoogleLogin({ label }: UseGoogleLoginOptions) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [googleEmail, setGoogleEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    resend,
    message: resendMessage,
    error: resendError,
    isPending: isResending,
    clearFeedback,
  } = useResendVerification();

  async function handleCredentialResponse(response: { credential?: string }) {
    if (!response.credential) {
      setError("Google OAuth that bai. Vui long thu lai.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    clearFeedback();

    try {
      const googleUser = decodeGoogleCredential(response.credential);

      setGoogleEmail(googleUser.email);

      const result = await authService.googleLogin({
        email: googleUser.email,
        full_name: googleUser.name || "",
        avatar_url: googleUser.picture || "",
        id_token: response.credential,
      });

      if (result.isNewUser) {
        const flashMessage = "Tao tai khoan thanh cong, email da xac thuc";

        sessionStorage.setItem(AUTH_FLASH_STORAGE_KEY, flashMessage);
        setSuccessMessage(flashMessage);
      }

      router.push("/");
    } catch (unknownError) {
      logAuthError("google-login", unknownError);
      const appError = normalizeHttpError(unknownError);
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  }

  const { buttonContainerRef, isReady } = useGoogleLoginReady({
    onCredentialResponse: handleCredentialResponse,
  });

  function loginWithGoogle() {
    clearFeedback();
    setError(null);
    setSuccessMessage(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError("Thieu cau hinh NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      return;
    }

    if (!isReady) {
      setError("Google OAuth chua san sang");
      return;
    }

    const trigger =
      buttonContainerRef.current?.querySelector<HTMLElement>('[role="button"]');

    if (!trigger) {
      setError("Google OAuth chua san sang");
      return;
    }

    try {
      trigger.click();
    } catch (unknownError) {
      logAuthError("google-login-click", unknownError);
      setError("Khong the mo Google OAuth");
    }
  }

  async function resendVerification() {
    if (!googleEmail) {
      setError("Khong co email de gui lai xac thuc");
      return;
    }

    await resend(googleEmail);
  }

  return {
    buttonContainerRef,
    isReady,
    label,
    loginWithGoogle,
    resendVerification,
    error,
    successMessage,
    resendMessage,
    resendError,
    canResendVerification:
      error === "Email chÆ°a Ä‘Æ°á»£c xÃ¡c thá»±c." && googleEmail.length > 0,
    isLoading,
    isResending,
  };
}
