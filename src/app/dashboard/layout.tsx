// app/Dashboard/layout.tsx

import DashboardLayout from '@/components/layout/dashboard-layout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout 
      userRole="ADMIN"           // ← এখানে UPPERCASE করো
      userName="Ayesa Rahman"
      avatarUrl="/avatar.jpg"
    >
      {children}
    </DashboardLayout>
  );
}