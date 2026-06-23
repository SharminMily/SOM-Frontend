"use client";

import { useEffect, useState, useMemo } from "react";
import { leaveApi } from "@/lib/api/leaves.api";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Send } from "lucide-react";

export default function ManagerLeavePage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<any[]>([]);

  const [form, setForm] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // LOAD MY REQUESTS
  const loadData = async () => {
    try {
      const res = await leaveApi.getMyRequests();
      console.log("MY REQUESTS:", res);

      setRequests(res?.data || []);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // APPLY LEAVE
  const applyLeave = async () => {
    try {
      // DEBUG
      console.log("PAYLOAD:", form);

      if (
        !form.leaveType ||
        !form.startDate ||
        !form.endDate ||
        !form.reason
      ) {
        alert("All fields required");
        return;
      }

      await leaveApi.applyLeave({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      setForm({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

      loadData();
    } catch (err: any) {
      console.log("SUBMIT ERROR:", err?.response?.data);
    }
  };

  // FILTER
  const filtered = useMemo(() => {
    const key = search.toLowerCase();

    return requests.filter((item) => {
      return (
        item?.leaveType?.toLowerCase().includes(key) ||
        item?.status?.toLowerCase().includes(key)
      );
    });
  }, [search, requests]);

  // STATS
  const total = requests.length;
  const pending = requests.filter((i) => i.status === "PENDING").length;
  const approved = requests.filter((i) => i.status === "APPROVED").length;
  const rejected = requests.filter((i) => i.status === "REJECTED").length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          My Leave Dashboard
        </h1>
        <p className="text-muted-foreground">
          Apply and track your leave requests
        </p>
      </div>

      {/* APPLY FORM */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Apply Leave</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          {/* LEAVE TYPE */}
          <select
            value={form.leaveType}
            onChange={(e) =>
              setForm({
                ...form,
                leaveType: e.target.value,
              })
            }
            className="w-full border rounded-md p-2"
          >
            <option value="CASUAL">CASUAL</option>
            <option value="SICK">SICK</option>
            <option value="ANNUAL">ANNUAL</option>
          </select>

          {/* DATES */}
          <div className="grid md:grid-cols-2 gap-3">

            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
            />

            <Input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
            />

          </div>

          {/* REASON */}
          <Input
            placeholder="Reason for leave"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
          />

          <Button onClick={applyLeave} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Leave Request
          </Button>

        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        <Stat label="Total" value={total} />
        <Stat label="Pending" value={pending} />
        <Stat label="Approved" value={approved} />
        <Stat label="Rejected" value={rejected} />

      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search by type or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <Card className="rounded-2xl">
        <CardContent className="p-0">

          <Table>

            <TableHeader>
              <TableRow>

                <TableHead>Type</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    No leave requests found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>

                    <TableCell>
                      {item.leaveType}
                    </TableCell>

                    <TableCell>
                      {new Date(item.startDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {new Date(item.endDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {item.totalDays}
                    </TableCell>

                    <TableCell>
                      <Badge>
                        {item.status}
                      </Badge>
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

/* STATS */
function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-background px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="text-xl font-bold">
        {value}
      </p>
    </div>
  );
}