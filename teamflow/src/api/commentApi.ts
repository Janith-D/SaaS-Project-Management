import axiosInstance from "./axiosInstance";
import { TaskComment, TaskAttachment } from "../types/task.types";
import { mapComment, mapAttachment } from "./responseMapper";

export const commentApi = {
  getComments: async (taskId: string): Promise<TaskComment[]> => {
    const response = await axiosInstance.get<any[]>(`/tasks/${taskId}/comments`);
    return (response.data || []).map(mapComment);
  },

  addComment: async (taskId: string, content: string): Promise<TaskComment> => {
    const response = await axiosInstance.post<any>(`/tasks/${taskId}/comments`, { content });
    return mapComment(response.data);
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await axiosInstance.delete(`/comments/${commentId}`);
  },

  getAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
    const response = await axiosInstance.get<any[]>(`/tasks/${taskId}/attachments`);
    return (response.data || []).map(mapAttachment);
  },

  uploadAttachment: async (taskId: string, _name: string, _type: string, _size: number, _mockUrl?: string): Promise<TaskAttachment> => {
    const response = await axiosInstance.post<any>(`/tasks/${taskId}/attachments`, {});
    return mapAttachment(response.data);
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    await axiosInstance.delete(`/attachments/${attachmentId}`);
  }
};
