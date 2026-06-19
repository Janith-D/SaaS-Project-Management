import axiosInstance from "./axiosInstance";
import { Task } from "../types/task.types";
import { mapTask } from "./responseMapper";

export const taskApi = {
  getTasks: async (projectId: string): Promise<Task[]> => {
    const response = await axiosInstance.get<any[]>(`/projects/${projectId}/tasks`);
    return (response.data || []).map(mapTask);
  },

  createTask: async (projectId: string, data: Partial<Task>): Promise<Task> => {
    const response = await axiosInstance.post<any>(`/projects/${projectId}/tasks`, data);
    return mapTask(response.data);
  },

  updateTask: async (taskId: string, data: Partial<Task>): Promise<Task> => {
    const response = await axiosInstance.put<any>(`/tasks/${taskId}`, data);
    return mapTask(response.data);
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await axiosInstance.delete(`/tasks/${taskId}`);
  }
};
