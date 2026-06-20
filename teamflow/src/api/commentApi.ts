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

  updateComment: async (commentId: string, content: string): Promise<TaskComment> => {
    const response = await axiosInstance.put<any>(`/comments/${commentId}`, { content });
    return mapComment(response.data);
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await axiosInstance.delete(`/comments/${commentId}`);
  },

  getAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
    const response = await axiosInstance.get<any[]>(`/tasks/${taskId}/attachments`);
    return (response.data || []).map(mapAttachment);
  },

  uploadAttachment: async (taskId: string, fileName: string, fileType: string, fileSize: number, file?: File): Promise<TaskAttachment> => {
    if (!file) {
      return mapAttachment({
        id: crypto.randomUUID(),
        fileName,
        fileType,
        fileSize,
        fileUrl: URL.createObjectURL(new Blob(["mock"], { type: fileType })),
        uploadedBy: "",
        createdAt: new Date().toISOString()
      });
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post<any>(`/tasks/${taskId}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return mapAttachment(response.data);
  },

  downloadAttachment: async (attachmentId: string): Promise<Blob> => {
    const response = await axiosInstance.get(`/attachments/${attachmentId}/download`, {
      responseType: "blob"
    });
    return response.data;
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    await axiosInstance.delete(`/attachments/${attachmentId}`);
  }
};
