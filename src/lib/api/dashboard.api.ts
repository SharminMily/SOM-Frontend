import api from "./axios";

export const dashboardApi = {
  getAdminDashboard: async () => {
    const { data } = await api.get("/dashboard/admin");
    return data;
  },

  getManagerDashboard: async () => {
    const { data } = await api.get("/dashboard/manager");
    return data;
  },

  getEmployeeDashboard: async () => {
    const { data } = await api.get("/dashboard/employee");
    return data;
  },
};