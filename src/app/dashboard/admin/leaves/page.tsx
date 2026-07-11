"use client";

import { useEffect, useMemo, useState } from "react";


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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  Check,
  X,
  CalendarDays,
} from "lucide-react";
import { leaveApi } from "@/lib/api/leaves.api";

export default function LeaveManagementPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const res = await leaveApi.getAllRequests();

      setRequests(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item?.user?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item?.leaveType
          ?.toLowerCase()
          .includes(keyword) ||
        item?.status
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [search, requests]);

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approvedRequests = requests.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedRequests = requests.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const handleApprove = async (id: string) => {
    try {
      await leaveApi.approveRequest(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      await leaveApi.rejectRequest(id, reason);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Leave Management
        </h1>

        <p className="text-muted-foreground">
          Manage employee leave requests
        </p>
      </div>



      {/* SEARCH + STATS */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        {/* SEARCH */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employee, leave type, status..."
            className="h-12 w-full rounded-2xl pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto lg:shrink-0">

          <div className="flex min-w-0 items-center gap-2 sm:gap-3 rounded-2xl border bg-background px-3 sm:px-4 py-3">
            <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">Total</p>
              <p className="truncate font-bold text-lg sm:text-xl">{totalRequests}</p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3 rounded-2xl border bg-background px-3 sm:px-4 py-3">
            <div className="h-3 w-3 shrink-0 rounded-full bg-yellow-500" />
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">Pending</p>
              <p className="truncate font-bold text-lg sm:text-xl text-yellow-500">{pendingRequests}</p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3 rounded-2xl border bg-background px-3 sm:px-4 py-3">
            <div className="h-3 w-3 shrink-0 rounded-full bg-green-500" />
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">Approved</p>
              <p className="truncate font-bold text-lg sm:text-xl text-green-500">{approvedRequests}</p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3 rounded-2xl border bg-background px-3 sm:px-4 py-3">
            <div className="h-3 w-3 shrink-0 rounded-full bg-red-500" />
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">Rejected</p>
              <p className="truncate font-bold text-lg sm:text-xl text-red-500">{rejectedRequests}</p>
            </div>
          </div>

        </div>
      </div>

      {/* TABLE */}

      <Card className="rounded-3xl border shadow-sm">

        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <Table>

              <TableHeader>

                <TableRow className="bg-muted/40">

                  <TableHead>Employee</TableHead>

                  <TableHead>
                    Leave Type
                  </TableHead>

                  <TableHead>
                    Total Days
                  </TableHead>

                  <TableHead>
                    Start Date
                  </TableHead>

                  <TableHead>
                    End Date
                  </TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {loading ? (
                  <TableRow>

                    <TableCell
                      colSpan={7}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>

                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>

                    <TableCell
                      colSpan={7}
                      className="h-24 text-center"
                    >
                      No leave requests found
                    </TableCell>

                  </TableRow>
                ) : (
                  filteredRequests.map(
                    (leave: any) => (
                      <TableRow key={leave.id} >

                        <TableCell className="font-medium">
                          {leave.user?.email || "No Email"}
                        </TableCell>

                        <TableCell>
                          {leave.leaveType}
                        </TableCell>

                        <TableCell>
                          {leave.totalDays}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            leave.startDate
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            leave.endDate
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell>

                          <Badge
                            variant={
                              leave.status ===
                                "APPROVED"
                                ? "default"
                                : leave.status ===
                                  "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {leave.status}
                          </Badge>

                        </TableCell>

                        <TableCell className="text-right">

                          {leave.status ===
                            "PENDING" && (
                              <div className="flex justify-end gap-2">

                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApprove(
                                      leave.id
                                    )
                                  }
                                >
                                  <Check className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleReject(
                                      leave.id
                                    )
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>

                              </div>
                            )}

                        </TableCell>

                      </TableRow>
                    )
                  )
                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}