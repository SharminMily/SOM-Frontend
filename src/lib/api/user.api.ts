
import api from "./axios";


export const userApi = {
  getAllUsers: async () => {
    const res = await api.get("/user");
    return res.data;
  },

  getUserId: async (id: string) => {
    const res = await api.get(`/user/${id}`);
    return res.data;
  },
  getUserIdDelete: async (id: string) => {
    const res = await api.delete(`/user/${id}`);
    return res.data;
  },
};