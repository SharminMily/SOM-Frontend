"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { attendanceApi } from "@/lib/api/attendance.api";
import { Attendance } from "@/app/types/attendance";



interface Props {
  departmentId: string;
}

export default function AttendancePage({
  departmentId,
}: Props) {
  const [records, setRecords] = useState<Attendance[]>(
    []
  );

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  });

  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1)
  );

  const [year, setYear] = useState(
    String(new Date().getFullYear())
  );

  const loadData = async () => {
    try {
      const attendanceRes =
        await attendanceApi.getDepartmentAttendance(
          departmentId,
          Number(month),
          Number(year)
        );

      const statsRes =
        await attendanceApi.getAttendanceStats(
          departmentId
        );

      setRecords(attendanceRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const getBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge className="bg-green-500">
            Present
          </Badge>
        );

      case "LATE":
        return (
          <Badge className="bg-yellow-500">
            Late
          </Badge>
        );

      default:
        return (
          <Badge variant="destructive">
            Absent
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-6">
            <p>Total</p>
            <h2 className="text-3xl font-bold">
              {stats.total}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Present</p>
            <h2 className="text-3xl font-bold text-green-600">
              {stats.present}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Late</p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {stats.late}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Absent</p>
            <h2 className="text-3xl font-bold text-red-600">
              {stats.absent}
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* FILTER */}

      <div className="flex gap-4">

        <Select
          value={month}
          onValueChange={setMonth}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {Array.from(
              { length: 12 },
              (_, i) => i + 1
            ).map((m) => (
              <SelectItem
                key={m}
                value={String(m)}
              >
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year}
          onValueChange={setYear}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[2025, 2026, 2027].map((y) => (
              <SelectItem
                key={y}
                value={String(y)}
              >
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* TABLE */}

      <Card>
        <CardHeader>
          <CardTitle>
            Department Attendance
          </CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {records.map((item) => (
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

                  <TableCell>
                    {getBadge(item.status)}
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