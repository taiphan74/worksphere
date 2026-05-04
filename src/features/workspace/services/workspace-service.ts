import { apiClientWithAuth } from "@/lib/http/api-client";
import {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceMember,
  AddMemberRequest,
  UpdateMemberRoleRequest,
  WorkspaceInvitation,
  WorkspaceInvitationWithDetails,
  SendInvitationRequest,
  AcceptInvitationRequest,
  Task,
} from "../types";
import { BaseResponse } from "@/lib/http/types";

// --- Types needed from the API ---
// Assuming standard response format: { data: T, message: string, status: number }

export const workspaceService = {
  // ─── Workspaces ─────────────────────────────────────────────────────────

  async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    const response = await apiClientWithAuth.post<BaseResponse<Workspace>>("/workspaces", data);
    return response.data.data;
  },

  async getWorkspaces(): Promise<Workspace[]> {
    const response = await apiClientWithAuth.get<BaseResponse<Workspace[]>>("/workspaces");
    return response.data.data;
  },

  async getWorkspaceById(id: string): Promise<Workspace> {
    const response = await apiClientWithAuth.get<BaseResponse<Workspace>>(`/workspaces/${id}`);
    return response.data.data;
  },

  async getWorkspaceBySlug(slug: string): Promise<Workspace> {
    const response = await apiClientWithAuth.get<BaseResponse<Workspace>>(`/workspaces/slug/${slug}`);
    return response.data.data;
  },

  async updateWorkspace(id: string, data: UpdateWorkspaceRequest): Promise<Workspace> {
    const response = await apiClientWithAuth.patch<BaseResponse<Workspace>>(`/workspaces/${id}`, data);
    return response.data.data;
  },

  async deleteWorkspace(id: string): Promise<void> {
    await apiClientWithAuth.delete(`/workspaces/${id}`);
  },

  // ─── Members ────────────────────────────────────────────────────────────

  async addMember(workspaceId: string, data: AddMemberRequest): Promise<WorkspaceMember> {
    const response = await apiClientWithAuth.post<BaseResponse<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members`,
      data,
    );
    return response.data.data;
  },

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await apiClientWithAuth.get<BaseResponse<WorkspaceMember[]>>(
      `/workspaces/${workspaceId}/members`,
    );
    return response.data.data;
  },

  async getMember(workspaceId: string, userId: string): Promise<WorkspaceMember> {
    const response = await apiClientWithAuth.get<BaseResponse<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members/${userId}`,
    );
    return response.data.data;
  },

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    data: UpdateMemberRoleRequest,
  ): Promise<WorkspaceMember> {
    const response = await apiClientWithAuth.patch<BaseResponse<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members/${userId}`,
      data,
    );
    return response.data.data;
  },

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await apiClientWithAuth.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────

  async getTasks(workspaceId: string): Promise<Task[]> {
    const response = await apiClientWithAuth.get<BaseResponse<Task[]>>(
      `/workspaces/${workspaceId}/tasks`,
    );
    return response.data.data;
  },

  // ─── Invitations ────────────────────────────────────────────────────────

  async sendInvitation(workspaceId: string, data: SendInvitationRequest): Promise<WorkspaceInvitation> {
    const response = await apiClientWithAuth.post<BaseResponse<WorkspaceInvitation>>(
      `/workspaces/${workspaceId}/invitations`,
      data,
    );
    return response.data.data;
  },

  async getInvitations(workspaceId: string): Promise<WorkspaceInvitation[]> {
    const response = await apiClientWithAuth.get<BaseResponse<WorkspaceInvitation[]>>(
      `/workspaces/${workspaceId}/invitations`,
    );
    return response.data.data;
  },

  async getInvitation(invitationId: string): Promise<WorkspaceInvitationWithDetails> {
    const response = await apiClientWithAuth.get<BaseResponse<WorkspaceInvitationWithDetails>>(
      `/invitations/${invitationId}`,
    );
    return response.data.data;
  },

  async acceptInvitation(data: AcceptInvitationRequest): Promise<void> {
    await apiClientWithAuth.post("/invitations/accept", data);
  },

  async declineInvitation(token: string): Promise<void> {
    await apiClientWithAuth.post("/invitations/decline", { token });
  },

  async cancelInvitation(invitationId: string): Promise<void> {
    await apiClientWithAuth.delete(`/invitations/${invitationId}`);
  },

  async resendInvitation(invitationId: string): Promise<void> {
    await apiClientWithAuth.post(`/invitations/${invitationId}/resend`);
  },
};
