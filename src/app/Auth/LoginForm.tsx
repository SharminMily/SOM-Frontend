"use client";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import { AuthUser, useAuthStore } from "@/lib/store/auth.store";


const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  EMPLOYEE: "/dashboard/employee",
};

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

const onSubmit = async (data: FormData) => {
  // console.log("Submitting", data);
  setServerError("");

  try {
    const res = await authApi.login({ 
      email: data.email, 
      password: data.password 
    });

   

    const responseData = res.data?.data ?? res.data;
    const accessToken = responseData?.accessToken;

    if (!accessToken) {
      throw new Error("No access token received from server");
    }

    const decoded = jwtDecode(accessToken) as any;

    const user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName || "",
      lastName: decoded.lastName || "",
      role: decoded.role,
      status: decoded.status,
      avatarUrl: decoded.avatarUrl ?? undefined,        // ← Important: null → undefined
      emailVerified: decoded.emailVerified ?? false,
      createdAt: decoded.createdAt ?? new Date().toISOString(),
      updatedAt: decoded.updatedAt ?? new Date().toISOString(),
    } as AuthUser;   // ← Cast to the one used by setAuth

    
    setAuth(user, accessToken);

    // console.log("✅ Login successful", user);
    router.push(ROLE_ROUTES[user.role] ?? "/dashboard");

  } catch (err: unknown) {
    console.error(err);
    const msg = (err as any)?.response?.data?.message ?? "Invalid credentials. Please try again.";
    setServerError(msg);
  }
};

  return (
    <div
      className="flex flex-col justify-center px-9 py-10"
      style={{ background: "#0d1520" }}
    >
      <h1 className="font-display text-[22px] font-bold tracking-tight text-white mb-1">
        Welcome back
      </h1>
      <p className="text-[13px] text-[#7fa89a] mb-7">Sign in to your SOM workspace</p>

      {/* Social */}
      <div className="grid grid-cols-2 gap-2 mb-1">
        {[
          {
            label: "Google",
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            ),
          },
          {
            label: "GitHub",
            icon: (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            ),
          },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-[9px] text-[12.5px] font-medium text-[#7fa89a] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {icon}
            Continue with {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
        <span className="text-[11px] text-[#3d6055]">or sign in with email</span>
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
      </div>

      {/* Error */}
      {serverError && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl px-4 py-3 text-[12.5px] text-red-400"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
          </svg>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-[#7fa89a]">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-[#3d6055] pointer-events-none" />
            <input
              {...register("email")}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full rounded-[9px] bg-[#111d2b] border border-[rgba(255,255,255,0.07)] pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#3d6055] outline-none focus:border-[rgba(16,185,129,0.5)] focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)] transition-all"
            />
          </div>
          {errors.email && <p className="text-[11.5px] text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-[#7fa89a]">Password</label>
            <a href="/auth/forgot-password" className="text-[11.5px] text-[#10B981] hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-[#3d6055] pointer-events-none" />
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-[9px] bg-[#111d2b] border border-[rgba(255,255,255,0.07)] pl-9 pr-10 py-2.5 text-[13px] text-white placeholder:text-[#3d6055] outline-none focus:border-[rgba(16,185,129,0.5)] focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d6055] hover:text-[#7fa89a] transition-colors"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11.5px] text-red-400">{errors.password.message}</p>}
        </div>

        {/* Remember */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            className="w-4 h-4 rounded flex items-center justify-center shrink-0"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)" }}
          >
            <svg className="w-2.5 h-2.5 text-[#10B981]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6l3 3 5-5" />
            </svg>
          </div>
          <input {...register("remember")} type="checkbox" className="sr-only" />
          <span className="text-[12px] text-[#7fa89a]">Keep me signed in on this device</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-[14px] font-semibold text-white disabled:opacity-60 transition-all hover:shadow-[0_4px_28px_rgba(16,185,129,0.38)] hover:-translate-y-px active:translate-y-0"
          style={{
            background: "linear-gradient(135deg,#10B981,#059669)",
            boxShadow: "0 2px 20px rgba(16,185,129,0.2)",
          }}
        >
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
            : <><span>Sign in to SOM</span><ArrowRight className="h-4 w-4" /></>
          }
        </button>
      </form>

      <p className="mt-5 text-center text-[12.5px] text-[#7fa89a]">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-[#10B981] hover:underline">Request access</a>
      </p>
    </div>
  );
}