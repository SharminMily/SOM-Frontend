import type { Metadata } from "next";

import { SignupForm } from "../SignupForm";
import { AuthLeftPanel } from "../AuthLeftPanel";

export const metadata: Metadata = { title: "Create account — SOM" };

export default function SignupPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-[rgba(16,185,129,0.18)] shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
        <AuthLeftPanel
          headline={<>Join <em className="not-italic text-[#10B981]">thousands</em> of teams already running smarter</>}
          subtext="Set up your workspace in minutes. Choose your role and start managing from day one."
          features={[
            { icon: "🛡", label: "Four access levels",  value: "Admin · HR · Manager · Employee"       },
            { icon: "🔐", label: "Enterprise security",  value: "JWT + bcrypt + httpOnly cookies"        },
            { icon: "⚡", label: "Production-ready",     value: "Next.js 16 + Node + PostgreSQL"         },
          ]}
        />
        <SignupForm />
      </div>
    </div>
  );
}