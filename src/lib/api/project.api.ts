import api from "./axios";

export const projectApi = {
  getAllProjects: async () => {
    const res = await api.get("/project");
    return res.data;
  },

  getProjectById: async (id: string) => {
    const res = await api.get(`/project/${id}`);
    return res.data;
  },

  createProject: async (data: any) => {
    const res = await api.post("/project", data);
    return res.data;
  },

  updateProject: async (id: string, data: any) => {
    const res = await api.patch(`/project/${id}`, data);
    return res.data;
  },

  deleteProject: async (id: string) => {
    const res = await api.delete(`/project/${id}`);
    return res.data;
  },

  addMember: async (projectId: string, data: any) => {
    const res = await api.post(
      `/project/${projectId}/members`,
      data
    );

    return res.data;
  },

  removeMember: async (
    projectId: string,
    userId: string
  ) => {
    const res = await api.delete(
      `/project/${projectId}/members/${userId}`
    );

    return res.data;
  },
};