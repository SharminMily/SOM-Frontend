"use client";

import { useEffect, useState } from "react";

import { attendanceApi } from "@/lib/api/attendance.api";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/auth.store";
import { AxiosError } from "axios";
import { toast } from "sonner";

type TeamAttendance = {
  id: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  clockIn: string | null;
  clockOut: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
     role: string;
  };
};

export default function TeamAttendanceTab() {
  const { user } = useAuthStore();
   console.log("records user", user);
    console.log("departmentId check:", user?.departmentId);
  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState<TeamAttendance[]>([]);
  console.log("records employee", records);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  });

const loadData = async () => {
  try {
    setLoading(true);

   const attendanceRes = await attendanceApi.getAllTodayAttendance();

console.log("RAW response:", attendanceRes.data); // eita age add korun

const employeeOnly: TeamAttendance[] = (attendanceRes.data || []).filter(
  (item: TeamAttendance) => item.user.role === "EMPLOYEE"
);

console.log("Filtered:", employeeOnly);
    setRecords(employeeOnly);

    setStats({
      total: employeeOnly.length,
      present: employeeOnly.filter((r) => r.status === "PRESENT").length,
      late: employeeOnly.filter((r) => r.status === "LATE").length,
      absent: employeeOnly.filter((r) => r.status === "ABSENT").length,
    });
  } catch (err) {
    const error = err as AxiosError<any>;
    toast.error(
      error.response?.data?.message || "Failed to load attendance"
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadData();
}, []);

useEffect(() => {
  loadData();
}, []);

  useEffect(() => {
    loadData();
  }, [user]);

  const getWorkingHours = (
    clockIn: string | null,
    clockOut: string | null
  ) => {
    if (!clockIn || !clockOut) return "-";

    const start = new Date(clockIn).getTime();
    const end = new Date(clockOut).getTime();

    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-4">

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p>Total</p>
            <h2 className="text-3xl font-bold">
              {stats.total}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p>Present</p>
            <h2 className="text-3xl font-bold text-green-500">
              {stats.present}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p>Late</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {stats.late}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <p>Absent</p>
            <h2 className="text-3xl font-bold text-red-500">
              {stats.absent}
            </h2>
          </CardContent>
        </Card>

      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-0">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Working Hours</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (

                records.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.user.firstName} {item.user.lastName}
                    </TableCell>

                    <TableCell>{item.user.email}</TableCell>

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
                        ? new Date(item.clockIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {item.clockOut
                        ? new Date(item.clockOut).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          item.clockOut
                            ? "font-medium text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        {getWorkingHours(item.clockIn, item.clockOut)}
                      </span>
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