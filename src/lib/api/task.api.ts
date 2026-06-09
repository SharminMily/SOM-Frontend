import api from "./axios";

export const taskApi = {
  getProjectTasks: async (
    projectId: string
  ) => {
    const res = await api.get(
      `/task/project/${projectId}`
    );

    return res.data;
  },

  createTask: async (
    projectId: string,
    data: any
  ) => {
    const res = await api.post(
      `/task/project/${projectId}`,
      data
    );

    return res.data;
  },

  updateTask: async (
    id: string,
    data: any
  ) => {
    const res = await api.patch(
      `/task/${id}`,
      data
    );

    return res.data;
  },

  deleteTask: async (id: string) => {
    const res = await api.delete(
      `/task/${id}`
    );

    return res.data;
  },
};