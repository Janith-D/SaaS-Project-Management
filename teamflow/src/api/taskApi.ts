import axiosInstance from "./axiosInstance";
import { Task } from "../types/task.types";
import { mapTask } from "./responseMapper";

export const taskApi = {
  getTasks: async (projectId: string): Promise<Task[]> => {
    const response = await axiosInstance.get<any>(`/projects/${projectId}/tasks`);
    const tasks = response.data?.content ?? (Array.isArray(response.data) ? response.data : []);
    return tasks.map(mapTask);
  },

  getTask: async (taskId: string): Promise<Task> => {
    const response = await axiosInstance.get<any>(`/tasks/${taskId}`);
    return mapTask(response.data);
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
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<Task> => {
    const response = await axiosInstance.patch<any>(`/tasks/${taskId}/status`, { status });
    return mapTask(response.data);
  },

  updateTaskAssignee: async (taskId: string, assigneeId: string | null): Promise<Task> => {
    const response = await axiosInstance.patch<any>(`/tasks/${taskId}/assignee`, { assigneeId });
    return mapTask(response.data);
  },

  updateTaskPriority: async (taskId: string, priority: string): Promise<Task> => {
    const response = await axiosInstance.patch<any>(`/tasks/${taskId}/priority`, { priority });
    return mapTask(response.data);
  },

  updateTaskDueDate: async (taskId: string, dueDate: string | null): Promise<Task> => {
    const response = await axiosInstance.patch<any>(`/tasks/${taskId}/due-date`, { dueDate });
    return mapTask(response.data);
  },

  moveTask: async (taskId: string, status: string, position: number): Promise<Task> => {
    const response = await axiosInstance.patch<any>(`/tasks/${taskId}/move`, { status, position });
    return mapTask(response.data);
  },

  createSubtask: async (taskId: string, title: string): Promise<Task> => {
    const response = await axiosInstance.post<any>(`/tasks/${taskId}/subtasks`, { title });
    return mapTask(response.data);
  }
};
