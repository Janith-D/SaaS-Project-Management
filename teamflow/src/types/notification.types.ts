export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "USER_MENTIONED"
  | "DEADLINE_REMINDER"
  | "INVITATION_SENT"
  | "PROJECT_COMPLETED";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  read: boolean;
  createdAt: string;
}
