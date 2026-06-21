import axiosInstance from "./axiosInstance";
import { Project } from "../types/project.types";
import { WorkspaceMember } from "../types/user.types";
import { mapProject } from "./responseMapper";

export const projectApi = {
  getProjects: async (workspaceId: string): Promise<Project[]> => {
    if (!workspaceId) throw new Error("workspaceId is required");
    const response = await axiosInstance.get<any[]>(`/workspaces/${workspaceId}/projects`);
    return (response.data || []).map(mapProject);
  },

  getProject: async (projectId: string): Promise<Project> => {
    const response = await axiosInstance.get<any>(`/projects/${projectId}`);
    return mapProject(response.data);
  },

  createProject: async (workspaceId: string, data: { name: string; description: string }): Promise<Project> => {
    const response = await axiosInstance.post<any>(`/workspaces/${workspaceId}/projects`, data);
    return mapProject(response.data);
  },

  updateProject: async (projectId: string, data: Partial<Project>): Promise<Project> => {
    const response = await axiosInstance.put<any>(`/projects/${projectId}`, data);
    return mapProject(response.data);
  },

  updateProjectStatus: async (projectId: string, status: string): Promise<Project> => {
    const response = await axiosInstance.patch<any>(`/projects/${projectId}/status`, { status });
    return mapProject(response.data);
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${projectId}`);
  },

  addMember: async (projectId: string, userId: string, role: string): Promise<WorkspaceMember> => {
    const response = await axiosInstance.post<any>(`/projects/${projectId}/members`, { userId, role });
    return response.data;
  },

  getProjectMembers: async (projectId: string): Promise<WorkspaceMember[]> => {
    const response = await axiosInstance.get<any[]>(`/projects/${projectId}/members`);
    return response.data || [];
  },

  removeProjectMember: async (projectId: string, memberId: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${projectId}/members/${memberId}`);
  }
};
