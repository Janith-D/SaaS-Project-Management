import axiosInstance from "./axiosInstance";
import { TaskComment, TaskAttachment } from "../types/task.types";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const commentApi = {
  getComments: async (taskId: string): Promise<TaskComment[]> => {
    if (USE_MOCK) {
      return await mockDb.getComments(taskId);
    }
    const response = await axiosInstance.get<TaskComment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  },

  addComment: async (taskId: string, content: string): Promise<TaskComment> => {
    if (USE_MOCK) {
      return await mockDb.addComment(taskId, content);
    }
    const response = await axiosInstance.post<TaskComment>(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.deleteComment(commentId);
      return;
    }
    await axiosInstance.delete(`/comments/${commentId}`);
  },

  getAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
    if (USE_MOCK) {
      return await mockDb.getAttachments(taskId);
    }
    const response = await axiosInstance.get<TaskAttachment[]>(`/tasks/${taskId}/attachments`);
    return response.data;
  },

  uploadAttachment: async (taskId: string, name: string, type: string, size: number, mockUrl?: string): Promise<TaskAttachment> => {
    if (USE_MOCK) {
      return await mockDb.uploadAttachment(taskId, name, type, size, mockUrl);
    }
    const formData = new FormData();
    // In real app we put file. But since we use JSON content structure to spring boot, we can simulate:
    formData.append("name", name);
    formData.append("type", type);
    formData.append("size", size.toString());
    const response = await axiosInstance.post<TaskAttachment>(`/tasks/${taskId}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.deleteAttachment(attachmentId);
      return;
    }
    await axiosInstance.delete(`/attachments/${attachmentId}`);
  }
};
