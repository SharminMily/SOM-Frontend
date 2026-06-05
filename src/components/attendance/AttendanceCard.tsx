"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAttendanceStore } from "@/lib/store/attendance.store";


export default function AttendanceCard() {
  const { today, clockIn, clockOut } = useAttendanceStore();

  return (
    <Card>
      <CardContent className="p-6">

        <h2 className="text-xl font-semibold mb-4">
          Today's Attendance
        </h2>

        <div className="space-y-2">

          <p>
            Status:
            <span className="font-medium ml-2">
              {today?.status ?? "ABSENT"}
            </span>
          </p>

          <p>
            Clock In:
            <span className="ml-2">
              {today?.clockIn
                ? new Date(today.clockIn).toLocaleTimeString()
                : "--"}
            </span>
          </p>

          <p>
            Clock Out:
            <span className="ml-2">
              {today?.clockOut
                ? new Date(today.clockOut).toLocaleTimeString()
                : "--"}
            </span>
          </p>

        </div>

        <div className="flex gap-3 mt-6">

          <Button onClick={clockIn}>
            Clock In
          </Button>

          <Button
            variant="outline"
            onClick={clockOut}
          >
            Clock Out
          </Button>

        </div>

      </CardContent>
    </Card>
  );
}