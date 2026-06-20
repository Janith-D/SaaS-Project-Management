import { Project } from "../types/project.types";
import { Task, TaskComment, TaskAttachment, ActivityLog } from "../types/task.types";
import { Workspace } from "../types/workspace.types";
import { WorkspaceMember } from "../types/user.types";

export function mapProject(raw: any): Project {
  return {
    id: raw.id,
    workspaceId: raw.workspaceId,
    name: raw.name,
    description: raw.description || "",
    status: raw.status || "PLANNING",
    progress: raw.progress ?? 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    startDate: raw.startDate,
    endDate: raw.deadline || raw.endDate,
    ownerId: raw.createdBy || raw.ownerId,
    members: raw.members || []
  };
}

export function mapTask(raw: any): Task {
  return {
    id: raw.id,
    projectId: raw.projectId,
    title: raw.title,
    description: raw.description || "",
    status: raw.status || "TODO",
    priority: raw.priority || "MEDIUM",
    type: raw.type || "TASK",
    creatorId: raw.reporterId || raw.createdBy || raw.creatorId,
    assigneeId: raw.assigneeId,
    assigneeName: raw.assigneeName,
    assigneeAvatar: raw.assigneeAvatar,
    dueDate: raw.dueDate,
    estimatedHours: raw.estimatedHours,
    actualHours: raw.actualHours,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    position: raw.position ?? 0,
    commentCount: raw.commentCount ?? 0,
    attachmentCount: raw.attachmentCount ?? 0
  };
}

export function mapComment(raw: any): TaskComment {
  return {
    id: raw.id,
    taskId: raw.taskId,
    authorId: raw.authorId || raw.userId,
    authorName: raw.authorName || "",
    authorAvatar: raw.authorProfileImage || raw.authorAvatar,
    content: raw.content || raw.commentText,
    createdAt: raw.createdAt
  };
}

export function mapAttachment(raw: any): TaskAttachment {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/v1$/, "") || "";
  return {
    id: raw.id,
    taskId: raw.taskId,
    name: raw.fileName || raw.name,
    size: raw.fileSize || raw.size || 0,
    type: raw.fileType || raw.type || "",
    url: raw.fileUrl || raw.url || (raw.id ? `${baseUrl}/api/v1/attachments/${raw.id}/download` : "#"),
    uploadedBy: raw.uploadedBy,
    uploadedByName: raw.uploadedByName || "",
    uploadedAt: raw.createdAt || raw.uploadedAt
  };
}

export function mapActivityLog(raw: any): ActivityLog {
  return {
    id: raw.id,
    workspaceId: raw.workspaceId,
    projectId: raw.projectId,
    taskId: raw.taskId,
    userId: raw.actorId || raw.userId,
    userName: raw.actorName || raw.userName || "",
    userAvatar: raw.userAvatar,
    action: raw.description || raw.action,
    timestamp: raw.createdAt || raw.timestamp
  };
}

export function mapWorkspace(raw: any): Workspace {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || "",
    slug: raw.slug || raw.name?.toLowerCase().replace(/\s+/g, "-"),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    ownerId: raw.ownerId,
    plan: raw.plan || "FREE",
    projectCount: raw.projectCount ?? raw.projectCount,
    memberCount: raw.memberCount ?? raw.memberCount
  };
}

export function mapWorkspaceMember(raw: any): WorkspaceMember {
  return {
    id: raw.userId || raw.id,
    fullName: raw.fullName || raw.user?.fullName || "",
    email: raw.email || raw.user?.email || "",
    role: raw.role,
    status: raw.status || "ACTIVE",
    joinedDate: raw.joinedAt || raw.joinedDate,
    avatarUrl: raw.avatarUrl || raw.profileImageUrl
  };
}

export function mapNotification(raw: any): any {
  return {
    id: raw.id,
    userId: raw.userId || raw.user?.id,
    title: raw.title,
    message: raw.message,
    read: raw.read !== undefined ? raw.read : raw.isRead,
    createdAt: raw.createdAt,
    type: raw.type || "GENERAL",
    relatedEntityType: raw.relatedEntityType || null,
    relatedEntityId: raw.relatedEntityId || null
  };
}
