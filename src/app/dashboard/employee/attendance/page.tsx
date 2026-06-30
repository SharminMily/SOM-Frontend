"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, LogIn, LogOut, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { attendanceApi } from "@/lib/api/attendance.api";


type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

interface AttendanceRecord {
  id?: string;
  date?: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  note?: string;
}

interface ToastState {
  message: string;
  kind: "success" | "error";
}

const STATUS_STYLES: Record<AttendanceStatus, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  PRESENT: { label: "Present", icon: CheckCircle2, classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  LATE: { label: "Late", icon: AlertCircle, classes: "bg-amber-50 text-amber-700 border-amber-200" },
  ABSENT: { label: "Absent", icon: XCircle, classes: "bg-rose-50 text-rose-700 border-rose-200" },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const cfg = STATUS_STYLES[status] || STATUS_STYLES.ABSENT;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.classes}`}>
      <Icon size={13} />
      {cfg.label}
    </span>
  );
}

function formatTime(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short" });
}

function buildMonthRecords(
  records: AttendanceRecord[],
  month: number,
  year: number
): AttendanceRecord[] {
  const byDate = new Map<string, AttendanceRecord>();
  records.forEach((r) => {
    const key = new Date(r.date || r.clockIn || "").toDateString();
    byDate.set(key, r);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year, month, 0).getDate();
  const result: AttendanceRecord[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    if (date > today) break; // don't mark future days as absent

    const key = date.toDateString();
    const existing = byDate.get(key);
    if (existing) {
      result.push(existing);
    } else {
      result.push({ date: date.toISOString(), status: "ABSENT" });
    }
  }

  return result.reverse(); // newest first
}

export default function EmployeeAttendancePage() {
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceApi.getMyAttendance(month, year);
      const raw: AttendanceRecord[] = Array.isArray(res) ? res : res?.data ?? [];
      const list = buildMonthRecords(raw, month, year);
      setRecords(list);

      const todayStr = new Date().toDateString();
      const todaysRecord = list.find(
        (r) => new Date(r.date || r.clockIn || "").toDateString() === todayStr
      );
      setClockedIn(Boolean(todaysRecord?.clockIn && !todaysRecord?.clockOut));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't load your attendance. Try again.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  function showToast(message: string, kind: ToastState["kind"] = "success") {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleClockIn() {
    setBusy(true);
    try {
      const trimmedNote = note.trim();
      await attendanceApi.clockIn(trimmedNote ? { note: trimmedNote } : {});
      setNote("");
      showToast("Clocked in. Have a good shift.");
      await loadAttendance();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Couldn't clock in.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleClockOut() {
    setBusy(true);
    try {
      await attendanceApi.clockOut();
      showToast("Clocked out. See you next time.");
      await loadAttendance();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Couldn't clock out.", "error");
    } finally {
      setBusy(false);
    }
  }

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m);
    setYear(y);
  }

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
            <p className="mt-1 text-sm text-slate-500">Track your clock-ins and view your monthly record.</p>
          </div>
          <div className="hidden rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:block">
            <Clock className="text-slate-400" size={22} />
          </div>
        </div>

        {/* Clock in/out card */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${clockedIn ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="text-sm font-medium text-slate-700">
                  {clockedIn ? "You're clocked in" : "You're clocked out"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {today.toLocaleDateString([], { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              {!clockedIn && (
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note (optional)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-56"
                />
              )}
              <button
                onClick={handleClockIn}
                disabled={busy || clockedIn}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LogIn size={16} />
                {busy ? "Clocking in…" : "Clock in"}
              </button>
              <button
                onClick={handleClockOut}
                disabled={busy || !clockedIn}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LogOut size={16} />
                {busy ? "Clocking out…" : "Clock out"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-xl font-semibold text-emerald-600">{presentCount}</p>
            <p className="text-xs text-slate-500">Present</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-xl font-semibold text-amber-600">{lateCount}</p>
            <p className="text-xs text-slate-500">Late</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-xl font-semibold text-rose-600">{absentCount}</p>
            <p className="text-xs text-slate-500">Absent</p>
          </div>
        </div>

        {/* Month navigation */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <CalendarDays size={18} className="text-slate-400" />
            <span className="text-sm font-medium">{MONTH_NAMES[month - 1]} {year}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => shiftMonth(-1)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => shiftMonth(1)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Records table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">Loading your attendance…</div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-rose-500">{error}</div>
          ) : records.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">No attendance records for this month yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Clock in</th>
                  <th className="px-5 py-3 font-medium">Clock out</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id || i} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 text-slate-700">{formatDate(r.date || r.clockIn)}</td>
                    <td className="px-5 py-3 text-slate-500">{formatTime(r.clockIn)}</td>
                    <td className="px-5 py-3 text-slate-500">{formatTime(r.clockOut)}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${
            toast.kind === "error" ? "bg-rose-600" : "bg-slate-900"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}