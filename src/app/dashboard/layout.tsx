"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/lib/store/auth.store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated]);

   if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-[#7fa89a]">Loading…</div>;
  }

  if (!user) return null;

  return (
    <DashboardLayout role={user.role} userName={`${user.firstName} ${user.lastName}`}>
      {children}
    </DashboardLayout>
  );
}