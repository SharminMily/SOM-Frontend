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



export default function TeamAttendanceTab() {
  const { user } = useAuthStore();

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  });

  const loadData = async () => {
    if (!user?.departmentId) return;

    try {
      const attendanceRes =
        await attendanceApi.getDepartmentAttendance(
          user.departmentId
        );

      const statsRes =
        await attendanceApi.getAttendanceStats(
          user.departmentId
        );

      setRecords(attendanceRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

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
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {records.map((item: any) => (
                <TableRow key={item.id}>

                  <TableCell>
                    {item.user.firstName}{" "}
                    {item.user.lastName}
                  </TableCell>

                  <TableCell>
                    {new Date(
                      item.date
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Badge>
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {item.clockIn
                      ? new Date(
                          item.clockIn
                        ).toLocaleTimeString()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {item.clockOut
                      ? new Date(
                          item.clockOut
                        ).toLocaleTimeString()
                      : "-"}
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </div>
  );
}