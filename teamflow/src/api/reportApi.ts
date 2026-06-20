import axiosInstance from "./axiosInstance";

export const reportApi = {
  downloadProjectPdf: async (projectId: string): Promise<Blob> => {
    const response = await axiosInstance.get(`/projects/${projectId}/reports/pdf`, {
      responseType: "blob"
    });
    return response.data;
  },

  downloadWorkspacePdf: async (workspaceId: string): Promise<Blob> => {
    const response = await axiosInstance.get(`/workspaces/${workspaceId}/reports/pdf`, {
      responseType: "blob"
    });
    return response.data;
  },

  downloadProjectExcel: async (projectId: string): Promise<Blob> => {
    const response = await axiosInstance.get(`/projects/${projectId}/reports/excel`, {
      responseType: "blob"
    });
    return response.data;
  }
};
