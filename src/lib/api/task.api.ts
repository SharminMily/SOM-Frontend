import api from "./axios";

export const taskApi = {
  getProjectTasks: async (projectId: string) => {
    const res = await api.get(`/task/project/${projectId}`);
    return res.data;
  },

  createTask: async (projectId: string, data: any) => {
    const res = await api.post(`/task/project/${projectId}`, data);
    return res.data;
  },

  getTaskById: async (id: string) => {
    const res = await api.get(`/task/${id}`);
    return res.data;
  },

  updateTask: async (id: string, data: any) => {
    const res = await api.patch(`/task/${id}`, data);
    return res.data;
  },

  deleteTask: async (id: string) => {
    const res = await api.delete(`/task/${id}`);
    return res.data;
  },

  getTaskComments: async (taskId: string) => {
    const res = await api.get(`/task/${taskId}/comments`);
    return res.data;
  },

  addComment: async (taskId: string, data: { content: string }) => {
    const res = await api.post(`/task/${taskId}/comments`, data);
    return res.data;
  },

  deleteComment: async (taskId: string, commentId: string) => {
    const res = await api.delete(`/task/${taskId}/comments/${commentId}`);
    return res.data;
  },
};