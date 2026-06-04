import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
console.log("Dashboard Layout User:", user);
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout
      role={user.role}
      userName={user.name}
    >
      {children}
    </DashboardLayout>
  );
}