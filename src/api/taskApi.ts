import axiosInstance from "./axiosInstance";
import { Task } from "../types/task.types";
import { mockDb } from "../utils/mockDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

export const taskApi = {
  getTasks: async (projectId: string): Promise<Task[]> => {
    if (USE_MOCK) {
      return await mockDb.getTasks(projectId);
    }
    const response = await axiosInstance.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  createTask: async (projectId: string, data: Partial<Task>): Promise<Task> => {
    if (USE_MOCK) {
      return await mockDb.createTask(projectId, data);
    }
    const response = await axiosInstance.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTask: async (taskId: string, data: Partial<Task>): Promise<Task> => {
    if (USE_MOCK) {
      return await mockDb.updateTask(taskId, data);
    }
    const response = await axiosInstance.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    if (USE_MOCK) {
      await mockDb.deleteTask(taskId);
      return;
    }
    await axiosInstance.delete(`/tasks/${taskId}`);
  }
};
