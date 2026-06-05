"use client";

import { useEffect } from "react";
import AttendanceCard from "@/components/attendance/AttendanceCard";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { useAttendanceStore } from "@/lib/store/attendance.store";


export default function AttendancePage() {
  const { getToday, getHistory } =
    useAttendanceStore();

  useEffect(() => {
    getToday();
    getHistory();
  }, []);

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Attendance
        </h1>

        <p className="text-muted-foreground">
          Manage your attendance records
        </p>
      </div>

      <AttendanceCard />

      <AttendanceTable />

    </div>
  );
}