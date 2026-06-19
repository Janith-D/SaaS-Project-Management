export interface Workspace {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  projectCount?: number;
  memberCount?: number;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  workspaceName: string;
  email: string;
  role: "WORKSPACE_ADMIN" | "PROJECT_MANAGER" | "MEMBER" | "VIEWER";
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  invitedBy: string;
  createdAt: string;
}

export interface WorkspaceStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMembers: number;
  totalTasks: number;
  overdueTasks: number;
  completionPercentage: number;
}
