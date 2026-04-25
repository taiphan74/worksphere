import type { AuthUser } from "@/features/auth/types/auth.types";
import type { Workspace } from "@/features/workspace/types";

export type SessionState =
  | { kind: "guest" }
  | { kind: "authed_not_onboarded"; user: AuthUser }
  | { kind: "authed_onboarded"; user: AuthUser; workspaces: Workspace[] };
