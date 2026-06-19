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
