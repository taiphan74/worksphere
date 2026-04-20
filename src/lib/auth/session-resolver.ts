import { cookies } from "next/headers";

import type { AuthUser, ApiEnvelope } from "@/features/auth/types/auth.types";
import type { Workspace } from "@/features/workspace/types";

import type { SessionState } from "@/lib/auth/navigation-resolver";
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

export async function resolveSessionState(): Promise<SessionState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return { type: "guest" };
  }

  try {
    const api = await createServerApiClient();
    const [userResult, workspaceResult] = await Promise.allSettled([
      api.get<{ user: ApiUser } | BaseResponse<{ user: ApiUser }> | ApiEnvelope<{ user: ApiUser }>>("/auth/me"),
      api.get<Workspace[] | BaseResponse<Workspace[]> | ApiEnvelope<Workspace[]>>("/workspaces"),
    ]);

    if (userResult.status !== "fulfilled" || workspaceResult.status !== "fulfilled") {
      return { type: "guest" };
    }

    const user = normalizeUser(unwrapData(userResult.value.data).user);
    const workspaces = unwrapData(workspaceResult.value.data);
    const hasFullName = Boolean(user.fullName?.trim());
    const hasWorkspace = workspaces.length > 0;

    if (!hasFullName || !hasWorkspace) {
      return { type: "authed_not_onboarded", user };
    }

    return { type: "authed_onboarded", user, workspaces };
  } catch {
    return { type: "guest" };
  }
}
