"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./DashboardNavbar";

interface Props {
  children: React.ReactNode;
  role: string;
  userName: string;
  avatarUrl?: string;
}

export default function DashboardLayout({ children, role, userName, avatarUrl }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar role={role} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          onMenuClick={() => setDrawerOpen(true)}
          name={userName}
          role={role}
          avatarUrl={avatarUrl}
        />
        <main className="flex-1 overflow-y-auto md:p-6 p-3">{children}</main>
      </div>
    </div>
  );
}