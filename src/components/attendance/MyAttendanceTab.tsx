"use client";

import { useEffect, useMemo, useState } from "react";
import { attendanceApi } from "@/lib/api/attendance.api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Badge } from "../ui/badge";

type AttendanceRecord = {
  id: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  clockIn: string | null;
  clockOut: string | null;
};

export default function MyAttendanceTab() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await attendanceApi.getMyAttendance();

      setRecords(res.data || []);
    } catch (err) {
      const error = err as AxiosError<any>;

      toast.error(
        error.response?.data?.message ||
        "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      await attendanceApi.clockIn({});

      toast.success("Clock In successful");

      loadData();
    } catch (err) {
      const error = err as AxiosError<any>;

      toast.error(
        error.response?.data?.message || "Clock In failed"
      );
    }
  };

  const handleClockOut = async () => {
    try {
      await attendanceApi.clockOut();

      toast.success("Clock Out successful");

      loadData();
    } catch (err) {
      const error = err as AxiosError<any>;

      toast.error(
        error.response?.data?.message || "Clock Out failed"
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      present: records.filter((r) => r.status === "PRESENT").length,
      late: records.filter((r) => r.status === "LATE").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
    };
  }, [records]);

  return (
    <div className="space-y-6">

      {/* STATS */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Present</p>
            <h2 className="text-3xl font-bold text-green-500">
              {stats.present}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Late</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {stats.late}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Absent</p>
            <h2 className="text-3xl font-bold text-red-500">
              {stats.absent}
            </h2>
          </CardContent>
        </Card>

      </div> */}



      <div className="grid gap-4 md:grid-cols-4">

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Present</p>
            <h2 className="text-3xl font-bold text-green-500">
              {stats?.present ?? 0}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Late</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {stats?.late ?? 0}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Absent</p>
            <h2 className="text-3xl font-bold text-red-500">
              {stats?.absent ?? 0}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Total</p>
            <h2 className="text-3xl font-bold text-blue-500">
              {(stats?.present ?? 0) +
                (stats?.late ?? 0) +
                (stats?.absent ?? 0)}
            </h2>
          </CardContent>
        </Card>

      </div>



      {/* ACTIONS */}
      <div className="flex gap-4">
        <Button
          size="lg"
          onClick={handleClockIn}
          disabled={loading}
        >
          {loading ? "Loading..." : "Clock In"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleClockOut}
          disabled={loading}
        >
          {loading ? "Loading..." : "Clock Out"}
        </Button>
      </div>

      {/* TABLE */}
      <Card className="rounded-3xl">
        <CardContent className="p-0">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                records.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
  <Badge
    variant={
      item.status === "PRESENT"
        ? "default"
        : item.status === "LATE"
        ? "secondary"
        : "destructive"
    }
  >
    {item.status}
  </Badge>
</TableCell>

                    <TableCell>
                      {item.clockIn
                        ? new Date(item.clockIn).toLocaleTimeString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {item.clockOut
                        ? new Date(item.clockOut).toLocaleTimeString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </div>
  );
}