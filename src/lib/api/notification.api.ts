import api from "./axios";


export const notificationApi = {
    getNotifications: async (
        page = 1,
        limit = 20
    ) => {
        const { data } = await api.get(
            "/notifications/me",
            {
                params: { page, limit },
            }
        );

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

    getAnnouncements: async () => {
        const { data } = await api.get(
          "/notifications/me",
            {
                params: {
                    type: "ANNOUNCEMENT",
                    page: 1,
                    limit: 20,
                },
            }
        );

        return data;
    },
};