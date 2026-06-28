"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { attendanceApi } from "@/lib/api/attendance.api";
import { toast } from "sonner";
import {
  LogIn,
  LogOut,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function calcDuration(clockIn: string | null, clockOut: string | null) {
  if (!clockIn || !clockOut) return null;
  const a = new Date(clockIn), b = new Date(clockOut);
  const mins = Math.round((b.getTime() - a.getTime()) / 60000);
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const STATUS_MAP = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    badge: "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
    dot: "bg-[#1D9E75]",
  },
  LATE: {
    label: "Late",
    icon: AlertCircle,
    badge: "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
    dot: "bg-[#BA7517]",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    badge: "bg-[#FCEBEB] text-[#A32D2D] border-[#F09595]",
    dot: "bg-[#E24B4A]",
  },
} as const;

type Status = keyof typeof STATUS_MAP;

// ─── sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status as Status] ?? STATUS_MAP.ABSENT;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl border shadow-none">
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          {label}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [today, setToday] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const now = new Date();

      const res = await attendanceApi.getMyAttendance(
        now.getMonth() + 1,
        now.getFullYear()
      );

      const data = res?.data ?? [];

      // Sort newest-first so the table always reads top-to-bottom = most recent first,
      // regardless of what order the API returns rows in.
      const sorted = [...data].sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setHistory(sorted);

      // BUG FIX: previously this just grabbed data[0] and assumed it was "today".
      // That only works if the API happens to return today's row first. Instead,
      // explicitly match on today's date so `today` is always correct (or null
      // if there's genuinely no record yet).
      const todayStr = now.toDateString();
      const todaysRecord =
        sorted.find((r: any) => new Date(r.date).toDateString() === todayStr) ??
        null;

      setToday(todaysRecord);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClockIn = async () => {
    try {
      setClockLoading(true);
      await attendanceApi.clockIn({});
      toast.success("Clocked in successfully");
      await loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to clock in");
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setClockLoading(true);
      await attendanceApi.clockOut();
      toast.success("Clocked out successfully");
      await loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message ?? "Failed to clock out");
    } finally {
      setClockLoading(false);
    }
  };

  const present = history.filter((r) => r.status === "PRESENT").length;
  const late = history.filter((r) => r.status === "LATE").length;
  const absent = history.filter((r) => r.status === "ABSENT").length;

  const now = new Date();
  const monthLabel = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  // Derived booleans so the JSX below stays readable.
  const hasClockedIn = !!today?.clockIn;
  const hasClockedOut = !!today?.clockOut;
  const canClockIn = !hasClockedIn; // can only clock in if not already clocked in today
  const canClockOut = hasClockedIn && !hasClockedOut; // can only clock out after clocking in, and only once

  // TEMP DEBUG — remove once the disabled-button cause is confirmed.
  console.log("DEBUG today:", today);
  console.log("DEBUG hasClockedIn:", hasClockedIn, "hasClockedOut:", hasClockedOut, "clockLoading:", clockLoading, "canClockOut:", canClockOut);

  return (
    <div className="min-h-screen bg-muted/30 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium">Attendance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track your daily working activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleClockIn}
            disabled={clockLoading || !canClockIn}
            className="gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            Clock In
          </Button>

          {/* This button was missing entirely — handleClockOut had no way to be triggered. */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleClockOut}
            disabled={clockLoading || !canClockOut}
            className="gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Clock Out
          </Button>
        </div>
      </div>

      {/* ── Today's stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Today's status">
          {today?.status ? (
            <StatusBadge status={today.status} />
          ) : (
            <span className="text-sm text-muted-foreground">Not marked</span>
          )}
        </StatCard>

        <StatCard label="Clock in">
          <p className="text-lg font-medium">{fmt(today?.clockIn ?? null)}</p>
        </StatCard>

        <StatCard label="Clock out">
          <p className={`text-lg font-medium ${!today?.clockOut ? "text-muted-foreground" : ""}`}>
            {fmt(today?.clockOut ?? null)}
          </p>
        </StatCard>

        <StatCard label="Working hours">
          <p className={`text-lg font-medium ${!today?.clockIn ? "text-muted-foreground" : ""}`}>
            {calcDuration(today?.clockIn, today?.clockOut) ?? "—"}
          </p>
        </StatCard>
      </div>

      {/* ── Monthly history ── */}
      <Card className="rounded-xl border">
        <CardContent className="p-0">

          {/* HEADER */}
          <div className="px-4 md:px-6 py-4 border-b">
            <h2 className="text-base font-semibold">Monthly Attendance</h2>
            <p className="text-xs text-muted-foreground">
              Your check-in history for this month
            </p>
          </div>

          {/* TABLE HEADER (desktop only) */}
          <div className="hidden md:grid grid-cols-3 px-6 py-3 text-xs font-medium text-muted-foreground border-b">
            <div>Date</div>
            <div>Status</div>
            <div className="text-right">Time</div>
          </div>

          {/* ROWS */}
          <div className="divide-y">

            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : history.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No records found
              </div>
            ) : (
              history.map((item: any) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0 px-4 md:px-6 py-4"
                >

                  {/* DATE */}
                  <div className="text-sm font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </div>

                  {/* STATUS */}
                  <div>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* TIME */}
                  <div className="text-sm md:text-right text-muted-foreground">
                    {item.clockIn ? fmt(item.clockIn) : "--"}
                    {" → "}
                    {item.clockOut ? fmt(item.clockOut) : "--"}
                  </div>

                </div>
              ))
            )}

          </div>

        </CardContent>
      </Card>
    </div>
  );
}