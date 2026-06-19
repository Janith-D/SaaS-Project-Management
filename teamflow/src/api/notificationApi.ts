import axiosInstance from "./axiosInstance";
import { mapNotification } from "./responseMapper";

export const notificationApi = {
  getNotifications: async (): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>("/notifications");
    return (response.data || []).map(mapNotification);
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch("/notifications/read-all");
  }
};
