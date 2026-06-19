import axiosInstance from "./axiosInstance";
import { WorkspaceStats } from "../types/workspace.types";
import { ActivityLog } from "../types/task.types";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const dashboardApi = {
  getWorkspaceStats: async (workspaceId: string): Promise<WorkspaceStats> => {
    if (USE_MOCK) {
      return await mockDb.getWorkspaceStats(workspaceId);
    }
    const response = await axiosInstance.get<WorkspaceStats>(`/workspaces/${workspaceId}/stats`);
    return response.data;
  },

  getActivityLogs: async (workspaceId: string): Promise<ActivityLog[]> => {
    if (USE_MOCK) {
      return await mockDb.getActivities(workspaceId);
    }
    const response = await axiosInstance.get<ActivityLog[]>(`/workspaces/${workspaceId}/activities`);
    return response.data;
  },

  getAdminStats: async (): Promise<any> => {
    if (USE_MOCK) {
      return await mockDb.getAdminStats();
    }
    const response = await axiosInstance.get<any>("/admin/stats");
    return response.data;
  }
};
