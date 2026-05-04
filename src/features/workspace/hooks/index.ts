import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../services/workspace-service";
import {
  AddMemberRequest,
  CreateWorkspaceRequest,
  UpdateMemberRoleRequest,
  UpdateWorkspaceRequest,
  SendInvitationRequest,
  AcceptInvitationRequest,
} from "../types";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  list: (filters: string) => [...workspaceKeys.lists(), { filters }] as const,
  details: () => [...workspaceKeys.all, "detail"] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  detailBySlug: (slug: string) => [...workspaceKeys.details(), "slug", slug] as const,
  members: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "members"] as const,
  tasks: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "tasks"] as const,
  invitations: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "invitations"] as const,
  invitationDetail: (invitationId: string) => ["invitations", invitationId] as const,
};

// ─── Workspaces ─────────────────────────────────────────────────────────

export const useWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => workspaceService.getWorkspaces(),
  });
};

export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => workspaceService.getWorkspaceById(id),
    enabled: !!id,
  });
};

export const useWorkspaceBySlug = (slug: string) => {
  return useQuery({
    queryKey: workspaceKeys.detailBySlug(slug),
    queryFn: () => workspaceService.getWorkspaceBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => workspaceService.createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
};

export const useUpdateWorkspace = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceRequest) => workspaceService.updateWorkspace(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detailBySlug(data.slug) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
};

export const useDeleteWorkspace = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workspaceService.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
};

// ─── Members ────────────────────────────────────────────────────────────

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId),
    queryFn: () => workspaceService.getMembers(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useAddMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberRequest) => workspaceService.addMember(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
};

export const useUpdateMemberRole = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateMemberRoleRequest }) =>
      workspaceService.updateMemberRole(workspaceId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
};

export const useRemoveMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => workspaceService.removeMember(workspaceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
};

// ─── Tasks ───────────────────────────────────────────────────────────────

export const useWorkspaceTasks = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.tasks(workspaceId),
    queryFn: () => workspaceService.getTasks(workspaceId),
    enabled: !!workspaceId,
  });
};

// ─── Invitations ────────────────────────────────────────────────────────

export const useWorkspaceInvitations = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.invitations(workspaceId),
    queryFn: () => workspaceService.getInvitations(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useInvitation = (invitationId: string) => {
  return useQuery({
    queryKey: workspaceKeys.invitationDetail(invitationId),
    queryFn: () => workspaceService.getInvitation(invitationId),
    enabled: !!invitationId,
  });
};

export const useSendInvitation = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendInvitationRequest) => workspaceService.sendInvitation(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.invitations(workspaceId) });
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) => workspaceService.acceptInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
};

export const useDeclineInvitation = () => {
  return useMutation({
    mutationFn: (token: string) => workspaceService.declineInvitation(token),
  });
};

export const useCancelInvitation = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => workspaceService.cancelInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.invitations(workspaceId) });
    },
  });
};

export const useResendInvitation = () => {
  return useMutation({
    mutationFn: (invitationId: string) => workspaceService.resendInvitation(invitationId),
  });
};
