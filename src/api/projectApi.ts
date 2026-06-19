import axiosInstance from "./axiosInstance";
import { Project, ProjectStatus } from "../types/project.types";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const projectApi = {
  getProjects: async (workspaceId: string): Promise<Project[]> => {
    if (USE_MOCK) {
      return await mockDb.getProjects(workspaceId);
    }
    const response = await axiosInstance.get<Project[]>(`/workspaces/${workspaceId}/projects`);
    return response.data;
  },

  createProject: async (workspaceId: string, data: { name: string; description: string; status?: ProjectStatus }): Promise<Project> => {
    if (USE_MOCK) {
      return await mockDb.createProject(workspaceId, data.name, data.description, data.status);
    }
    const response = await axiosInstance.post<Project>(`/workspaces/${workspaceId}/projects`, data);
    return response.data;
  },

  updateProject: async (projectId: string, data: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) {
      return await mockDb.updateProject(projectId, data);
    }
    const response = await axiosInstance.put<Project>(`/projects/${projectId}`, data);
    return response.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.deleteProject(projectId);
      return;
    }
    await axiosInstance.delete(`/projects/${projectId}`);
  }
};
