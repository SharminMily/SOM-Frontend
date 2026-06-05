import api from "./axios";

export const attendanceApi = {
  getMyAttendance: async () => {
    const res = await api.get("/attendance/me");
    return res.data.data; // IMPORTANT FIX
  },

  clockIn: async () => {
    const res = await api.post("/attendance/clock-in");
    return res.data;
  },

  clockOut: async () => {
    const res = await api.patch("/attendance/clock-out");
    return res.data;
  },
};