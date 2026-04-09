import { getCurrentUser } from "./auth-checker";
import { apiClientWithAuth } from "../http/api-client";
import { cookies } from "next/headers";

/**
 * Checks if the current user has completed onboarding.
 * This is used server-side to gate access to the app.
 *
 * Criteria for complete onboarding:
 * 1. User has a fullName
 * 2. User belongs to at least 1 workspace
 */
export async function isUserOnboarded(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return false;
  }

  try {
    // Chạy song song: kiểm tra user + lấy workspaces
    const [user, { data: workspacesResponse }] = await Promise.all([
      getCurrentUser(),
      apiClientWithAuth.get("/workspaces", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ]);

    if (!user || !user.data || !user.data.full_name) {
      return false;
    }

    const workspaces = workspacesResponse?.data;
    if (!workspaces || workspaces.length === 0) {
      return false;
    }

    return true;
  } catch (error) {
    // In case of API error, default to false to force them through checks
    console.error("Error checking onboarding status:", error);
    return false;
  }
}
