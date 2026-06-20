import axiosInstance from "./axiosInstance";
import { SubscriptionPlan, WorkspaceSubscription, WorkspaceUsage } from "../types/user.types";

export const subscriptionApi = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await axiosInstance.get<any[]>("/subscription-plans");
    return response.data || [];
  },

  getWorkspaceSubscription: async (workspaceId: string): Promise<WorkspaceSubscription> => {
    const response = await axiosInstance.get<any>(`/workspaces/${workspaceId}/subscription`);
    return response.data;
  },

  changePlan: async (workspaceId: string, planCode: string): Promise<WorkspaceSubscription> => {
    const response = await axiosInstance.post<any>(`/workspaces/${workspaceId}/subscription/change-plan`, { planCode });
    return response.data;
  },

  getUsage: async (workspaceId: string): Promise<WorkspaceUsage> => {
    const response = await axiosInstance.get<any>(`/workspaces/${workspaceId}/usage`);
    return response.data;
  }
};
