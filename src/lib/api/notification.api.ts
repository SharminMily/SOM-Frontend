import api from "./axios";

export const notificationApi = {
  getNotifications: async (page = 1, limit = 20) => {
    const { data } = await api.get("/notifications/me", {
      params: { page, limit },
    });

    return data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get(
      "/notifications/me/unread-count"
    );

    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.patch(
      `/notifications/${id}/read`
    );

    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch(
      "/notifications/me/read-all"
    );

    return data;
  },

createNotification: async (payload: {
  title: string;
  message: string;
  type: string;
}) => {
  const { data } = await api.post("/notifications", payload);
  return data;
},

  updateNotification: async (
    id: string,
    payload: {
      title: string;
      message: string;
      type: string;
    }
  ) => {
    const { data } = await api.patch(
      `/notifications/${id}`,
      payload
    );

    return data;
  },
};