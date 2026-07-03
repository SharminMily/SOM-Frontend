import api from "./axios";

export const dashboardApi = {

   getManagerDashboard: async () => {
    const { data } = await api.get("/dashboard/manager");
    console.log("dataaaaaaaaaa",data.data)
    return data.data;
  },

  getEmployeeDashboard: async () => {
    const { data } = await api.get("/dashboard/employee");
    return data;
  },

 
  
};