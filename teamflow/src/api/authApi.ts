import axiosInstance from "./axiosInstance";
import { AuthResponse, LoginRequest, RegisterRequest, UserInfo } from "../types/auth.types";

function mapUser(user: any): UserInfo {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.globalRole === "SUPER_ADMIN" ? "PLATFORM_ADMIN" : "MEMBER"
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<any>("/auth/login", data);
    return {
      accessToken: response.data.accessToken,
      tokenType: "Bearer",
      user: mapUser(response.data.user)
    };
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<any>("/auth/register", data);
    return {
      accessToken: response.data.accessToken,
      tokenType: "Bearer",
      user: mapUser(response.data.user)
    };
  },

  getCurrentUser: async (): Promise<UserInfo | null> => {
    try {
      const response = await axiosInstance.get<any>("/auth/me");
      return mapUser(response.data);
    } catch (e) {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("accessToken");
  }
};
