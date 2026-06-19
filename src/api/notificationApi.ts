import axiosInstance from "./axiosInstance";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const notificationApi = {
  getNotifications: async (): Promise<any[]> => {
    if (USE_MOCK) {
      return await mockDb.getNotifications();
    }
    const response = await axiosInstance.get<any[]>("/notifications");
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.markNotificationRead(id);
      return;
    }
    await axiosInstance.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.markAllNotificationsRead();
      return;
    }
    await axiosInstance.put("/notifications/read-all");
  }
};
