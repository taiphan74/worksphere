export function getVerificationUrl(locale: string, path: "verify-email" | "reset-password" = "verify-email"): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return `${window.location.origin}/${locale}/${path}`;
}
