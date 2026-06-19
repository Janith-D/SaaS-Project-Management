import axiosInstance from "./axiosInstance";
import { Project } from "../types/project.types";
import { mapProject } from "./responseMapper";

export const projectApi = {
  getProjects: async (workspaceId: string): Promise<Project[]> => {
    const response = await axiosInstance.get<any[]>(`/workspaces/${workspaceId}/projects`);
    return (response.data || []).map(mapProject);
  },

  createProject: async (workspaceId: string, data: { name: string; description: string }): Promise<Project> => {
    const response = await axiosInstance.post<any>(`/workspaces/${workspaceId}/projects`, data);
    return mapProject(response.data);
  },

  updateProject: async (projectId: string, data: Partial<Project>): Promise<Project> => {
    const response = await axiosInstance.put<any>(`/projects/${projectId}`, data);
    return mapProject(response.data);
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${projectId}`);
  }
};
