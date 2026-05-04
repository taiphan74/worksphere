import { appendFileSync } from "node:fs";

import { cookies } from "next/headers";

import type { AuthUser, ApiEnvelope } from "@/features/auth/types/auth.types";
import type { Workspace } from "@/features/workspace/types";

import type { SessionState } from "@/lib/auth/session-state";
import type { BaseResponse } from "@/lib/http/types";
import { createServerApiClient } from "@/lib/http/server-api";

type ApiUser = {
  id: string;
  email: string;
  full_name?: string;
  avatar_key?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

function debugLog(message: string, data?: unknown) {
  appendFileSync(
    "/tmp/worksphere-server-auth.log",
    `${new Date().toISOString()} ${message} ${data ? JSON.stringify(data) : ""}\n`,
  );
}

function normalizeUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    avatarKey: user.avatar_key,
    isVerified: user.is_verified,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function unwrapData<T>(payload: T | BaseResponse<T> | ApiEnvelope<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload as T;
}

/**
 * Tải trạng thái phiên hiện tại từ cookie và dữ liệu hồ sơ/workspace của server.
 */
export async function resolveSessionState(): Promise<SessionState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  debugLog("[session-resolver] start", {
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
  });

  if (!accessToken && !refreshToken) {
    debugLog("[session-resolver] no auth cookies -> guest");
    return { kind: "guest" };
  }

  try {
    const api = await createServerApiClient();
    debugLog("[session-resolver] calling /auth/me and /workspaces");
    const [userResult, workspaceResult] = await Promise.allSettled([
      api.get<{ user: ApiUser } | BaseResponse<{ user: ApiUser }> | ApiEnvelope<{ user: ApiUser }>>("/auth/me"),
      api.get<Workspace[] | BaseResponse<Workspace[]> | ApiEnvelope<Workspace[]>>("/workspaces"),
    ]);

    debugLog("[session-resolver] api results", {
      userStatus: userResult.status,
      workspaceStatus: workspaceResult.status,
    });

    if (userResult.status !== "fulfilled" || workspaceResult.status !== "fulfilled") {
      debugLog("[session-resolver] api failed -> guest", {
        userReason: userResult.status === "rejected" ? userResult.reason?.message : undefined,
        workspaceReason: workspaceResult.status === "rejected" ? workspaceResult.reason?.message : undefined,
      });
      return { kind: "guest" };
    }

    const user = normalizeUser(unwrapData(userResult.value.data).user);
    const workspaces = unwrapData(workspaceResult.value.data);
    const hasFullName = Boolean(user.fullName?.trim());
    const hasWorkspace = workspaces.length > 0;

    debugLog("[session-resolver] resolved user", {
      hasFullName,
      workspaceCount: workspaces.length,
    });

    if (!hasFullName || !hasWorkspace) {
      debugLog("[session-resolver] authed_not_onboarded");
      return { kind: "authed_not_onboarded", user };
    }

    debugLog("[session-resolver] authed_onboarded");
    return { kind: "authed_onboarded", user, workspaces };
  } catch (error) {
    debugLog("[session-resolver] caught error -> guest", {
      message: error instanceof Error ? error.message : String(error),
    });
    return { kind: "guest" };
  }
}
