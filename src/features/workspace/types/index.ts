export type WorkspaceRole = "OWNER" | "MEMBER";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  email: string;
  full_name?: string;
  avatar_key?: string;
  user_status: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceInvitationWithDetails extends WorkspaceInvitation {
  workspace_name: string;
  workspace_slug: string;
  inviter_name: string;
}

// ─── Requests ─────────────────────────────────────────────────────────────

export interface CreateWorkspaceRequest {
  name: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
}

export interface AddMemberRequest {
  user_id: string;
  role: WorkspaceRole;
}

export interface UpdateMemberRoleRequest {
  role: WorkspaceRole;
}

export interface SendInvitationRequest {
  email: string;
}

export interface AcceptInvitationRequest {
  token: string;
}
