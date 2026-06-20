import { Notification } from "../types/notification.types";
import axiosInstance from "./axiosInstance";
import { mapNotification } from "./responseMapper";

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get<Notification[]>("/notifications");
    return (response.data || []).map(mapNotification) as Notification[];
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get<{ count: number }>("/notifications/unread-count");
    return response.data?.count ?? 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch("/notifications/read-all");
  },

  deleteNotification: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/notifications/${id}`);
  }
};
