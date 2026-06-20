import axiosInstance from "./axiosInstance";
import { UserProfile } from "../types/user.types";

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<any>("/users/me");
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.put<any>("/users/me", data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosInstance.put("/users/me/password", { currentPassword, newPassword });
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post<any>("/users/me/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data?.profileImageUrl || response.data?.url || "";
  },

  searchUsers: async (query: string): Promise<UserProfile[]> => {
    const response = await axiosInstance.get<any[]>("/users/search", { params: { keyword: query } });
    return response.data || [];
  },

  deactivateAccount: async (): Promise<void> => {
    await axiosInstance.delete("/users/me");
  }
};
