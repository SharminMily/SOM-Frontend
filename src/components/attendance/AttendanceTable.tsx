"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendanceStore } from "@/lib/store/attendance.store";

export default function AttendanceTable() {
  const { attendance } = useAttendanceStore();

  return (
    <div className="border rounded-lg">
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
          {attendance.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {new Date(item.date).toLocaleDateString()}
              </TableCell>

              <TableCell>{item.status}</TableCell>

              <TableCell>
                {item.clockIn
                  ? new Date(item.clockIn).toLocaleTimeString()
                  : "--"}
              </TableCell>

              <TableCell>
                {item.clockOut
                  ? new Date(item.clockOut).toLocaleTimeString()
                  : "--"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}