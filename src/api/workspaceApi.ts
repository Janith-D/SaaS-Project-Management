import axiosInstance from "./axiosInstance";
import { Workspace } from "../types/workspace.types";
import { WorkspaceMember } from "../types/user.types";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const workspaceApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    if (USE_MOCK) {
      return await mockDb.getWorkspaces();
    }
    const response = await axiosInstance.get<Workspace[]>("/workspaces");
    return response.data;
  },

  createWorkspace: async (data: { name: string; description: string }): Promise<Workspace> => {
    if (USE_MOCK) {
      return await mockDb.createWorkspace(data.name, data.description);
    }
    const response = await axiosInstance.post<Workspace>("/workspaces", data);
    return response.data;
  },

  updateWorkspace: async (id: string, data: { name: string; description: string; plan?: "FREE" | "PRO" | "BUSINESS" }): Promise<Workspace> => {
    if (USE_MOCK) {
      return await mockDb.updateWorkspace(id, data.name, data.description, data.plan);
    }
    const response = await axiosInstance.put<Workspace>(`/workspaces/${id}`, data);
    return response.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.deleteWorkspace(id);
      return;
    }
    await axiosInstance.delete(`/workspaces/${id}`);
  },

  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    if (USE_MOCK) {
      return await mockDb.getWorkspaceMembers(workspaceId);
    }
    const response = await axiosInstance.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  inviteMember: async (workspaceId: string, email: string, role: string): Promise<WorkspaceMember> => {
    if (USE_MOCK) {
      return await mockDb.inviteMember(workspaceId, email, role);
    }
    const response = await axiosInstance.post<WorkspaceMember>(`/workspaces/${workspaceId}/invite`, { email, role });
    return response.data;
  },

  updateMemberRole: async (workspaceId: string, memberId: string, role: string): Promise<WorkspaceMember> => {
    if (USE_MOCK) {
      return await mockDb.updateMemberRole(workspaceId, memberId, role);
    }
    const response = await axiosInstance.put<WorkspaceMember>(`/workspaces/${workspaceId}/members/${memberId}`, { role });
    return response.data;
  },

  removeMember: async (workspaceId: string, memberId: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.removeMember(workspaceId, memberId);
      return;
    }
    await axiosInstance.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  }
};
