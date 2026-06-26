import api from "./axios";

export const dashboardApi = {
  getEmployeeDashboard: async () => {
    const { data } = await api.get("/dashboard/employee");
    return data;
  },
};