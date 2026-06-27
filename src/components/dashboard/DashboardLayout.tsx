"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./DashboardNavbar";
import { X } from "lucide-react";

interface Props {
  children: React.ReactNode;
  role: string;
  userName: string;
  avatarUrl?: string;
}

export default function DashboardLayout({
  children,
  role,
  userName,
  avatarUrl
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* SIDEBAR WRAPPER */}
          <div className="absolute left-0 top-0 h-full w-72 bg-background shadow-lg">

            {/* ONLY CLOSE BUTTON (NOT INSIDE SIDEBAR UI) */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md "
            >
              <X className="w-7 text-white h-" />
            </button>

            <Sidebar role={role} />
          </div>
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">

        <Navbar
          onMenuClick={() => setOpen(true)}
          name={userName}
          role={role}
           avatarUrl={avatarUrl}
        />
        <main className="flex-1 overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}