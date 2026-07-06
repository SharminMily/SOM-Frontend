import { create } from "zustand";
import { attendanceApi } from "@/lib/api/attendance.api";
import { Attendance } from "@/app/types/attendance";

interface AttendanceStore {
  attendance: Attendance[];
  loading: boolean;
  today: Attendance | null; // এটা যোগ করো

  getMyAttendance: () => Promise<void>;
  clockIn: () => Promise<void>;
  clockOut: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  attendance: [],
  loading: false,

  get today() {
    const todayStr = new Date().toDateString();
    return (
      get().attendance.find(
        (a) => new Date(a.date).toDateString() === todayStr
      ) ?? null
    );
  },

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
    await get().getMyAttendance(); // clock in এর পর data refresh
  },

  clockOut: async () => {
    await attendanceApi.clockOut();
    await get().getMyAttendance(); // clock out এর পর data refresh
  },
}));