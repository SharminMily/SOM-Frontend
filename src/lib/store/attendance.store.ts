import { create } from "zustand";
import { attendanceApi } from "@/lib/api/attendance.api";
import { Attendance } from "@/app/types/attendance";


interface AttendanceStore {
  attendance: Attendance[];
  loading: boolean;

  getMyAttendance: () => Promise<void>;
  clockIn: () => Promise<void>;
  clockOut: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  attendance: [],
  loading: false,

  getMyAttendance: async () => {
    set({ loading: true });

    const data = await attendanceApi.getMyAttendance();

    set({
      attendance: data,
      loading: false,
    });
  },

  clockIn: async () => {
    await attendanceApi.clockIn();
  },

  clockOut: async () => {
    await attendanceApi.clockOut();
  },
}));