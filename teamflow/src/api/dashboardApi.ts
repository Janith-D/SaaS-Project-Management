import axiosInstance from "./axiosInstance";
import { ActivityLog } from "../types/task.types";
import { mapActivityLog } from "./responseMapper";

export const dashboardApi = {
  getWorkspaceStats: async (workspaceId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/workspaces/${workspaceId}/dashboard`);
    return {
      totalProjects: response.data.totalProjects ?? 0,
      activeProjects: response.data.activeProjects ?? 0,
      completedProjects: response.data.completedProjects ?? 0,
      totalMembers: response.data.totalMembers ?? 0,
      totalTasks: response.data.totalTasks ?? 0,
      overdueTasks: response.data.overdueTasks ?? 0,
      completionPercentage: response.data.completionPercentage ?? 0
    };
  },

  getProjectDashboard: async (projectId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/projects/${projectId}/dashboard`);
    return response.data;
  },

  getUserDashboard: async (): Promise<any> => {
    const response = await axiosInstance.get<any>("/users/me/dashboard");
    return response.data;
  },

  getActivityLogs: async (workspaceId: string): Promise<ActivityLog[]> => {
    const response = await axiosInstance.get<any[]>(`/workspaces/${workspaceId}/activity-logs`);
    return (response.data || []).map(mapActivityLog);
  },

  getProjectActivityLogs: async (projectId: string): Promise<ActivityLog[]> => {
    const response = await axiosInstance.get<any[]>(`/projects/${projectId}/activity-logs`);
    return (response.data || []).map(mapActivityLog);
  },

  getTaskActivityLogs: async (taskId: string): Promise<ActivityLog[]> => {
    const response = await axiosInstance.get<any[]>(`/tasks/${taskId}/activity-logs`);
    return (response.data || []).map(mapActivityLog);
  },

  getAdminStats: async (): Promise<any> => {
    const response = await axiosInstance.get<any>("/admin/stats");
    return response.data;
  }
};
