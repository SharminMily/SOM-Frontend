import type { Metadata } from "next";
import { LoginForm } from "../LoginForm";
import { AuthLeftPanel } from "../AuthLeftPanel";

export const metadata: Metadata = { title: "Sign in — SOM" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 rounded-2xl overflow-hidden border border-[rgba(16,185,129,0.18)] shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
        <AuthLeftPanel
          headline={<>Your workspace,<br/><em className="not-italic text-[#10B981]">fully in control</em></>}
          subtext="One platform for HR, payroll, attendance, projects and your entire team — secured by role-based access."
          features={[
            { icon: "👥", label: "People management",   value: "Employees, roles & departments" },
            { icon: "💰", label: "Payroll & attendance", value: "Auto-generated, PDF payslips"    },
            { icon: "🗂", label: "Projects & tasks",     value: "Kanban boards, progress tracking" },
          ]}
        />
        <LoginForm />
      </div>
    </div>
  );
}