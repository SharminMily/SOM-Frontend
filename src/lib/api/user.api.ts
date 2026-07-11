
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
  // Admin: update any user
  updateUser: async (
    id: string,
    payload: {
      firstName?: string;
      lastName?: string;
      role?: string;
      status?: string;
      phone?: string;
      departmentId?: string;
    }
  ) => {
    const res = await api.patch(`/user/${id}`, payload);
    return res.data;
  },
   // Logged in user
  getMyProfile: async () => {
    const { data } = await api.get("/user/me");
    return data;
  },

  updateMyProfile: async (payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  }) => {
    const { data } = await api.patch("/user/me", payload);
    return data;
  },
  
};