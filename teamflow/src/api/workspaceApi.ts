import axiosInstance from "./axiosInstance";
import { Workspace } from "../types/workspace.types";
import { WorkspaceMember } from "../types/user.types";
import { mapWorkspace, mapWorkspaceMember } from "./responseMapper";

export const workspaceApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    const response = await axiosInstance.get<any[]>("/workspaces");
    return (response.data || []).map(mapWorkspace);
  },

  createWorkspace: async (data: { name: string; description: string }): Promise<Workspace> => {
    const response = await axiosInstance.post<any>("/workspaces", data);
    return mapWorkspace(response.data);
  },

  updateWorkspace: async (id: string, data: { name: string; description: string }): Promise<Workspace> => {
    const response = await axiosInstance.put<any>(`/workspaces/${id}`, data);
    return mapWorkspace(response.data);
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/workspaces/${id}`);
  },

  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    const response = await axiosInstance.get<any[]>(`/workspaces/${workspaceId}/members`);
    return (response.data || []).map(mapWorkspaceMember);
  },

  inviteMember: async (workspaceId: string, email: string, role: string): Promise<any> => {
    const response = await axiosInstance.post(`/workspaces/${workspaceId}/invitations`, { email, role });
    return response.data;
  },

  updateMemberRole: async (workspaceId: string, memberId: string, role: string): Promise<WorkspaceMember> => {
    const response = await axiosInstance.patch<any>(`/workspaces/${workspaceId}/members/${memberId}/role`, { role });
    return mapWorkspaceMember(response.data);
  },

  removeMember: async (workspaceId: string, memberId: string): Promise<void> => {
    await axiosInstance.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  }
};
