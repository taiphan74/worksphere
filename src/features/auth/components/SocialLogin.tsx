"use client";

import { Button } from "@/components/ui/button";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.23c0-.72-.064-1.41-.184-2.077H12v3.93h5.498a4.704 4.704 0 0 1-2.039 3.088v2.562h3.305c1.936-1.782 3.041-4.408 3.041-7.503Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.074-.914 6.764-2.477l-3.305-2.562c-.914.612-2.084.973-3.459.973-2.657 0-4.907-1.793-5.713-4.202H2.87v2.642A10.214 10.214 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.287 13.732A6.128 6.128 0 0 1 5.967 12c0-.601.108-1.185.32-1.732V7.626H2.87A10.214 10.214 0 0 0 1.818 12c0 1.652.396 3.216 1.052 4.374l3.417-2.642Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.067c1.5 0 2.846.516 3.906 1.529l2.929-2.93C17.07 3.026 14.756 2 12 2 7.87 2 4.286 4.367 2.87 7.626l3.417 2.642C7.093 7.86 9.343 6.067 12 6.067Z"
        fill="#EA4335"
      />
    </svg>
  );
}

type SocialLoginProps = {
  label?: string;
};

export function SocialLogin({
  label = "Đăng nhập với Google",
}: SocialLoginProps) {
  const {
    buttonContainerRef,
    isReady,
    loginWithGoogle,
    resendVerification,
    error,
    successMessage,
    resendMessage,
    resendError,
    canResendVerification,
    isLoading,
    isResending,
  } = useGoogleLogin({ label });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Hoặc
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <p>{error}</p>
          {canResendVerification ? (
            <ResendVerificationButton
              onClick={resendVerification}
              disabled={isResending}
            />
          ) : null}
        </div>
      ) : null}

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

      <div ref={buttonContainerRef} className="hidden" aria-hidden="true" />

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-xl border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={loginWithGoogle}
        disabled={!isReady || isLoading}
      >
        <GoogleIcon />
        {isLoading ? "Đang đăng nhập..." : label}
      </Button>
    </div>
  );
}
