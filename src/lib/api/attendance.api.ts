import api from "./axios";
export const attendanceApi = {
  // Employee
  clockIn: (payload?: { note?: string }) =>
    api.post("/attendance/clock-in", payload ?? {}).then((r) => r.data),
  clockOut: () =>
    api.patch("/attendance/clock-out").then((r) => r.data),

  getMyAttendance: (month?: number, year?: number) =>
    api
      .get("/attendance/me", {
        params: { month, year },
      })
      .then((r) => r.data),

  // Admin / Manager
  getUserAttendance: (
    userId: string,
    month?: number,
    year?: number
  ) =>
    api
      .get(`/attendance/user/${userId}`, {
        params: { month, year },
      })
      .then((r) => r.data),

  getDepartmentAttendance: (
    departmentId: string,
    month?: number,
    year?: number
  ) =>
    api
      .get(`/attendance/department/${departmentId}`, {
        params: { month, year },
      })
      .then((r) => r.data),

  getAttendanceStats: (departmentId: string) =>
    api
      .get(`/attendance/stats/${departmentId}`)
      .then((r) => r.data),

  overrideAttendance: (
    attendanceId: string,
    payload: {
      status: "PRESENT" | "LATE" | "ABSENT";
      note?: string;
    }
  ) =>
    api
      .patch(`/attendance/${attendanceId}`, payload)
      .then((r) => r.data),
     getAllTodayAttendance: () =>
  api.get(`/attendance/today`).then((r) => r.data), 
};