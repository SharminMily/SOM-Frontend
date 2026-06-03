import DashboardLayout from "@/components/layout/dashboard-layout";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardRootLayout({ children }: any) {
  const user = await getCurrentUser();
  
  console.log("✅ Server Current User:", user); // Keep this for now

  if (!user) {
    // Optional: Redirect to login if no user
    // redirect('/login');
  }

  return (
    <DashboardLayout
      userRole={user?.role ?? "EMPLOYEE"}
      userName={
        user?.name || 
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || 
        "Unknown User"
      }
      avatarUrl={user?.avatarUrl ?? "/default-avatar.jpg"}
    >
      {children}
    </DashboardLayout>
  );
}