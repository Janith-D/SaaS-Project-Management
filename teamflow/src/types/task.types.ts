export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskType = "TASK" | "BUG" | "FEATURE" | "IMPROVEMENT" | "RESEARCH" | "EPIC" | "STORY";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  creatorId: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  position: number; // for Kanban ordering
  commentCount?: number;
  attachmentCount?: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  name: string;
  size: number; // in bytes
  type: string; // mime type
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string; // e.g. "moved task to In Progress", "commented on task"
  timestamp: string;
}
