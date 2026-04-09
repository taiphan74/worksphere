import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiClientWithAuth } from "@/lib/http/api-client";

/**
 * Checks if user is authenticated by:
 * 1. Looking for access_token cookie
 * 2. Optionally validating with backend API
 * @param verifyWithBackend - Whether to make API call to /auth/me (default: true)
 * @param locale - Optional locale for redirect URL
 */
export async function checkAuth(verifyWithBackend: boolean = true, locale?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    const loginPath = locale ? `/${locale}/login` : "/login";
    redirect(loginPath);
  }

  if (verifyWithBackend) {
    try {
      // Optional backend verification
      await apiClientWithAuth.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      // If verification fails, redirect to login
      const loginPath = locale ? `/${locale}/login` : "/login";
      redirect(loginPath);
    }
  }
}

/**
 * Gets the current user data from backend
 */
export async function getCurrentUser() {
  try {
    const { data } = await apiClientWithAuth.get("/auth/me");
    return data;
  } catch {
    return null;
  }
}