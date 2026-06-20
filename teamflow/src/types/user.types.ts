import { UserInfo } from "./auth.types";

export interface UserProfile extends UserInfo {
  avatarUrl?: string;
  bio?: string;
  department?: string;
  phoneNumber?: string;
  joinedDate: string;
}

export type WorkspaceRole = "WORKSPACE_OWNER" | "WORKSPACE_ADMIN" | "PROJECT_MANAGER" | "MEMBER" | "VIEWER";

export interface WorkspaceMember {
  id: string;
  fullName: string;
  email: string;
  role: WorkspaceRole;
  status: "ACTIVE" | "PENDING" | "DECLINED";
  joinedDate?: string;
  avatarUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  maxMembers: number;
  maxProjects: number;
  maxStorage: number;
  features: string[];
}

export interface WorkspaceSubscription {
  id: string;
  workspaceId: string;
  plan: string;
  status: "ACTIVE" | "PAST_DUE" | "CANCELED";
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface WorkspaceUsage {
  memberCount: number;
  projectCount: number;
  storageUsed: number;
  maxMembers: number;
  maxProjects: number;
  maxStorage: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  globalRole: string;
  emailVerified: boolean;
  enabled: boolean;
  createdAt: string;
}

export interface AdminWorkspace {
  id: string;
  name: string;
  ownerName: string;
  memberCount: number;
  projectCount: number;
  plan: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalProjects: number;
  totalTasks: number;
  activeUsersLast30: number;
  storageUsed: number;
}
