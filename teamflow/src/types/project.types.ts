export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED" | "ARCHIVED";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  members: string[]; // User IDs
}

export interface ProjectStats {
  todoCount: number;
  inProgressCount: number;
  inReviewCount: number;
  blockedCount: number;
  doneCount: number;
  cancelledCount: number;
  highPriorityCount: number;
  overdueCount: number;
  tasksByAssignee: { assigneeId: string; assigneeName: string; taskCount: number }[];
}
