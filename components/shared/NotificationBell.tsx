"use client";

import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button className="relative">
      <Bell className="h-5 w-5" />
    </button>
  );
}