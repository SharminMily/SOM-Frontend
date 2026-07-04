"use client";

import { useEffect, useMemo, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RefreshCw } from "lucide-react";

import { attendanceApi } from "@/lib/api/attendance.api";
import { Attendance } from "@/app/types/attendance";

// If your Attendance type doesn't already include a role on `user`,
// extend it here rather than editing the shared type.
type AttendanceRow = Attendance & {
  user: Attendance["user"] & { role?: string };
};

type RoleFilter = "ALL" | "MANAGER" | "EMPLOYEE";
type StatusFilter = "ALL" | "PRESENT" | "LATE" | "ABSENT";

export default function AdminDailyAttendancePage() {
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await attendanceApi.getAllTodayAttendance();
      setRecords(res.data ?? res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: records.length,
      present: records.filter((r) => r.status === "PRESENT").length,
      late: records.filter((r) => r.status === "LATE").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      managers: records.filter(
        (r) => r.user.role?.toUpperCase() === "MANAGER"
      ).length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const fullName =
        `${item.user.firstName} ${item.user.lastName}`.toLowerCase();

      const matchesSearch = fullName.includes(
        search.trim().toLowerCase()
      );

      const role = item.user.role?.toUpperCase() ?? "EMPLOYEE";
      const matchesRole =
        roleFilter === "ALL" ||
        (roleFilter === "MANAGER" && role === "MANAGER") ||
        (roleFilter === "EMPLOYEE" && role !== "MANAGER");

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [records, search, roleFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Badge className="bg-green-500">Present</Badge>;
      case "LATE":
        return <Badge className="bg-yellow-500">Late</Badge>;
      default:
        return <Badge variant="destructive">Absent</Badge>;
    }
  };

  const getRoleBadge = (role?: string) => {
    if (role?.toUpperCase() === "MANAGER") {
      return <Badge variant="secondary">Manager</Badge>;
    }
    return <Badge variant="outline">Employee</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Today&apos;s Attendance
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <p>Total</p>
            <h2 className="text-3xl font-bold">{stats.total}</h2>
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

        <Card>
          <CardContent className="p-6">
            <p>Managers</p>
            <h2 className="text-3xl font-bold">{stats.managers}</h2>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-[260px]"
        />

        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as RoleFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PRESENT">Present</SelectItem>
            <SelectItem value="LATE">Late</SelectItem>
            <SelectItem value="ABSENT">Absent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees &amp; Managers</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRecords.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No attendance records found for today.
                  </TableCell>
                </TableRow>
              )}

              {filteredRecords.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.user.firstName} {item.user.lastName}
                  </TableCell>

                  <TableCell>{getRoleBadge(item.user.role)}</TableCell>

                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
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

                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}