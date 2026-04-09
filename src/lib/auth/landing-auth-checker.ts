import { cookies } from "next/headers";
import { apiClientWithAuth } from "@/lib/http/api-client";
import { workspaceService } from "@/features/workspace/services/workspace-service";
import type { AuthUser } from "@/features/auth/types/auth.types";

type LandingAuthResult =
  | { status: "not_authenticated" }
  | { status: "authenticated"; user: AuthUser; workspaces: { id: string; slug: string }[] };

/**
 * Kiểm tra auth state cho landing page.
 * Trả về thông tin user + workspace nếu có token hợp lệ.
 * Nếu không có token hoặc token lỗi → { status: "not_authenticated" }.
 */
export async function getLandingAuthState(): Promise<LandingAuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { status: "not_authenticated" };
  }

  try {
    // Fetch user profile
    const { data: userData } = await apiClientWithAuth.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user: AuthUser = {
      id: userData.data.id,
      email: userData.data.email,
      fullName: userData.data.full_name,
      avatarKey: userData.data.avatar_key,
      isVerified: userData.data.is_verified,
      createdAt: userData.data.created_at,
      updatedAt: userData.data.updated_at,
    };

    // Fetch workspaces
    const workspacesResponse = await workspaceService.getWorkspaces();
    const workspaces = workspacesResponse?.map((w) => ({
      id: w.id,
      slug: w.slug,
    })) ?? [];

    return { status: "authenticated", user, workspaces };
  } catch {
    return { status: "not_authenticated" };
  }
}
