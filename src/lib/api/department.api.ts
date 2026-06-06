import api from "./axios";

export const departmentApi = {
  getAlldepartments: async () => {
    const res = await api.get("/department");
    return res.data;
  },

  createDepartments: async (data: {
    name: string;
    description: string;
  }) => {
    const res = await api.post("/department", data);
    return res.data;
  },

  updateDepartments: async (
    id: string,
    data: {
      name: string;
      description: string;
    }
  ) => {
    const res = await api.patch(`/department/${id}`, data);
    return res.data;
  },

  getDepartmentId: async (id: string) => {
    const res = await api.get(`/department/${id}`);
    return res.data;
  },

  departmentIdDelete: async (id: string) => {
    const res = await api.delete(`/department/${id}`);
    return res.data;
  },
};