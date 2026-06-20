import axiosInstance from "./axiosInstance";
import { AdminUser, AdminWorkspace, AdminStats } from "../types/user.types";

export const adminApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await axiosInstance.get<any[]>("/admin/users");
    return response.data || [];
  },

  disableUser: async (userId: string): Promise<void> => {
    await axiosInstance.patch(`/admin/users/${userId}/disable`);
  },

  getWorkspaces: async (): Promise<AdminWorkspace[]> => {
    const response = await axiosInstance.get<any[]>("/admin/workspaces");
    return response.data || [];
  },

  getAuditLogs: async (): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>("/admin/audit-logs");
    return response.data || [];
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await axiosInstance.get<any>("/admin/stats");
    return response.data;
  }
};
