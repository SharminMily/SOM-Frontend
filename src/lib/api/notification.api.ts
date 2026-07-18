import api from "./axios";
export type NotificationType =
  | "LEAVE_STATUS"
  | "TASK_ASSIGNED"
  | "ANNOUNCEMENT"
  | "PAYSLIP_READY"
  | "SYSTEM";
export type TBroadcastTarget = "ALL" | "ROLE";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

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
  type: NotificationType; // <-- string থেকে বদলাও
}) => {
  const { data } = await api.post("/notifications", payload);
  return data;
},

createBroadcastNotification: async (payload: {
    title: string;
    message: string;
    type: NotificationType;
    target: TBroadcastTarget;
    roles?: Role[]; 
  }) => {
    const { data } = await api.post("/notifications/broadcast", payload);
    return data;
  },

updateNotification: async (
  id: string,
  payload: {
    title: string;
    message: string;
    type: NotificationType; // <-- string থেকে বদলাও
  }
) => {
  const { data } = await api.patch(
    `/notifications/${id}`,
    payload
  );

  return data;
},
};