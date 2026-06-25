"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Send } from "lucide-react";

import { toast } from "sonner";

export default function EmployeeLeavePage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // LOAD DATA
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await leaveApi.getMyRequests();
      setRequests(res?.data || []);

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load data");
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
      if (!form.startDate || !form.endDate || !form.reason) {
        toast.warning("Please fill all fields");
        return;
      }

      setSubmitting(true);

      await leaveApi.applyLeave(form);

      toast.success("Leave request submitted successfully");

      setForm({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

      await loadData();

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to submit request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // FILTER
  const filtered = useMemo(() => {
    const key = search.toLowerCase();

    return requests.filter((item) =>
      item?.leaveType?.toLowerCase().includes(key) ||
      item?.status?.toLowerCase().includes(key)
    );
  }, [search, requests]);

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <p className="text-sm text-muted-foreground">
          Apply and track your leave status
        </p>
      </div>

      {/* FORM */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <select
            className="w-full border rounded-md p-2"
            value={form.leaveType}
            onChange={(e) =>
              setForm({ ...form, leaveType: e.target.value })
            }
          >
            <option value="CASUAL">CASUAL</option>
            <option value="SICK">SICK</option>
            <option value="ANNUAL">ANNUAL</option>
          </select>

          <div className="grid md:grid-cols-2 gap-3">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />

            <Input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
            />
          </div>

          <Input
            placeholder="Reason..."
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
          />

          <Button
            onClick={applyLeave}
            className="w-full"
            disabled={submitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>

        </CardContent>
      </Card>

      {/* SEARCH */}
      <Input
        placeholder="Search leave type or status..."
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
                    <TableCell>{item.leaveType}</TableCell>
                    <TableCell>
                      {new Date(item.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(item.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.totalDays}</TableCell>
                    <TableCell>{item.status}</TableCell>
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