import axiosInstance from "./axiosInstance";
import { AuthResponse, LoginRequest, RegisterRequest, UserInfo } from "../types/auth.types";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      const res = await mockDb.login(data.email, data.password);
      return {
        accessToken: res.accessToken,
        tokenType: "Bearer",
        user: res.user
      };
    }
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<UserInfo> => {
    if (USE_MOCK) {
      const res = await mockDb.register(data.fullName, data.email);
      return res;
    }
    const response = await axiosInstance.post<UserInfo>("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserInfo | null> => {
    if (USE_MOCK) {
      return await mockDb.getCurrentUser();
    }
    try {
      const response = await axiosInstance.get<UserInfo>("/auth/me");
      return response.data;
    } catch (e) {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.logout();
      return;
    }
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("accessToken");
  }
};
