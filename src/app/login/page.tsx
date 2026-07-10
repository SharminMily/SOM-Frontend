import type { Metadata } from "next";
import { LoginForm } from "../Auth/LoginForm";
import { AuthLeftPanel } from "../Auth/AuthLeftPanel";

export const metadata: Metadata = { title: "Sign in — SOM" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 rounded-2xl overflow-hidden border border-emerald-500/20 dark:border-emerald-400/20 shadow-xl shadow-black/10 dark:shadow-black/70 bg-background">
        <AuthLeftPanel
          headline={<>Your workspace,<br/><em className="not-italic text-emerald-600 dark:text-[#10B981]">fully in control</em></>}
          subtext="One platform for HR, payroll, attendance, projects and your entire team — secured by role-based access."
          features={[
            { icon: "👥", label: "People management",   value: "Employees, roles & departments" },
            { icon: "🔔", label: "Notification & attendance", value: "Auto-generated, Announcement"    },
            { icon: "🎯", label: "Projects & tasks",     value: "progress tracking, boards, mission" },
          ]}
        />
        <LoginForm />
      </div>
    </div>
  );
}