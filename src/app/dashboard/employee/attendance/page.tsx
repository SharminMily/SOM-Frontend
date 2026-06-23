"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { attendanceApi } from "@/lib/api/attendance.api";

export default function AttendancePage() {
  const [today, setToday] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);

  // 📦 Load attendance data
  const loadData = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const res = await attendanceApi.getMyAttendance(month, year);

      // 🔥 FIX: flexible response handling
      const data =
        res?.data ||
        res?.attendance ||
        res?.records ||
        res ||
        [];

      setHistory(data);

      // 📅 today's record fix
      const todayDate = new Date().toISOString().split("T")[0];

      const todayRecord = data.find((item: any) =>
        (item.date || "").slice(0, 10) === todayDate
      );

      setToday(todayRecord || null);
    } catch (err) {
      console.log("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ⏱ Clock In
  const handleClockIn = async () => {
    try {
      setClockLoading(true);
      await attendanceApi.clockIn();
      await loadData();
    } catch (err) {
      console.log("Clock in error:", err);
    } finally {
      setClockLoading(false);
    }
  };

  // ⏱ Clock Out
  const handleClockOut = async () => {
    try {
      setClockLoading(true);
      await attendanceApi.clockOut();
      await loadData();
    } catch (err) {
      console.log("Clock out error:", err);
    } finally {
      setClockLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">
          Track your daily attendance
        </p>
      </div>

      {/* TODAY CARDS */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Today Status</p>
            <h2 className="text-xl font-bold">
              {today?.status || "Not Marked"}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Clock In</p>
            <h2 className="text-xl font-bold">
              {today?.clockInTime || "--"}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Clock Out</p>
            <h2 className="text-xl font-bold">
              {today?.clockOutTime || "--"}
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <Button
          onClick={handleClockIn}
          disabled={clockLoading || !!today?.clockInTime}
        >
          Clock In
        </Button>

        <Button
          variant="outline"
          onClick={handleClockOut}
          disabled={clockLoading || !today?.clockInTime || !!today?.clockOutTime}
        >
          Clock Out
        </Button>
      </div>

      {/* HISTORY */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">
            Monthly History
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-muted-foreground">
              No records found
            </p>
          ) : (
            <div className="space-y-2">

              {history.map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="flex justify-between border-b py-2"
                >
                  <span>{item.date?.slice(0, 10)}</span>
                  <span className="font-medium">
                    {item.status}
                  </span>
                  <span>
                    {item.clockInTime || "--"} →{" "}
                    {item.clockOutTime || "--"}
                  </span>
                </div>
              ))}

            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}