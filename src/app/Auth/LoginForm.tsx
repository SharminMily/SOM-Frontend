"use client";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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

// Theme tokens: everything the UI needs for both modes lives here,
// so switching theme is just swapping which object we read from.
const THEME = {
  dark: {
    pageBg: "#0a1119",
    cardBg: "#0d1520",
    inputBg: "#111d2b",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.12)",
    socialBg: "rgba(255,255,255,0.03)",
    socialHoverBg: "rgba(255,255,255,0.04)",
    divider: "rgba(255,255,255,0.07)",
    dividerText: "#3d6055",
    text: "#ffffff",
    subtext: "#7fa89a",
    placeholder: "#3d6055",
    errorBg: "rgba(239,68,68,0.1)",
    errorBorder: "rgba(239,68,68,0.2)",
    errorText: "#f87171",
  },
  light: {
    pageBg: "#eef3f1",
    cardBg: "#ffffff",
    inputBg: "#f4f7f6",
    border: "rgba(15,35,28,0.09)",
    borderHover: "rgba(15,35,28,0.18)",
    socialBg: "rgba(15,35,28,0.02)",
    socialHoverBg: "rgba(15,35,28,0.05)",
    divider: "rgba(15,35,28,0.09)",
    dividerText: "#6b8b7f",
    text: "#0f231c",
    subtext: "#4b6b5f",
    placeholder: "#9db3aa",
    errorBg: "rgba(239,68,68,0.08)",
    errorBorder: "rgba(239,68,68,0.18)",
    errorText: "#dc2626",
  },
} as const;

type Mode = "dark" | "light";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");

  // --- theme wired to the global next-themes provider ---
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mode: Mode = (resolvedTheme as Mode) ?? "dark";
  const c = THEME[mode];

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
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
        avatarUrl: decoded.avatarUrl ?? undefined,
        emailVerified: decoded.emailVerified ?? false,
        createdAt: decoded.createdAt ?? new Date().toISOString(),
        updatedAt: decoded.updatedAt ?? new Date().toISOString(),
      } as AuthUser;

      setAuth(user, accessToken);
      router.push(ROLE_ROUTES[user.role] ?? "/dashboard");

    } catch (err: unknown) {
      console.error(err);
      const msg = (err as any)?.response?.data?.message ?? "Invalid credentials. Please try again.";
      setServerError(msg);
    }
  };

  // Avoid rendering theme-dependent styles before hydration
  if (!mounted) return null;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:px-6 transition-colors duration-300"
      style={{ background: c.pageBg }}
    >
      <div
        className="relative w-full max-w-[420px] flex flex-col justify-center rounded-2xl px-6 py-8 sm:px-9 sm:py-10 transition-colors duration-300"
        style={{ background: c.cardBg }}
      >
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
          aria-label={mode === "dark" ? "Switch to day mode" : "Switch to dark mode"}
          className="absolute right-6 top-8 sm:right-9 sm:top-10 flex items-center justify-center w-8 h-8 rounded-full transition-all hover:-translate-y-px"
          style={{
            background: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(15,35,28,0.05)",
            border: `1px solid ${c.border}`,
            color: c.subtext,
          }}
        >
          {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <h1
          className="font-display text-[20px] sm:text-[22px] font-bold tracking-tight mb-1 pr-10"
          style={{ color: c.text }}
        >
          Welcome back
        </h1>
        <p className="text-[12.5px] sm:text-[13px] mb-6 sm:mb-7" style={{ color: c.subtext }}>
          Sign in to your SOM workspace
        </p>

        {/* Social */}
       <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2 mb-1">
  {[
    {
      label: "Google",
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
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
        <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
  ].map(({ label, icon }) => (
    <button
      key={label}
      type="button"
      className="w-full min-w-0 flex items-center justify-center gap-2 rounded-[9px] border py-2.5 px-3 text-[12.5px] font-medium transition-all"
      style={{
        background: c.socialBg,
        borderColor: c.border,
        color: c.subtext,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = c.socialHoverBg;
        e.currentTarget.style.borderColor = c.borderHover;
        e.currentTarget.style.color = c.text;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = c.socialBg;
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.color = c.subtext;
      }}
    >
      {icon}
      <span className="truncate">Continue with {label}</span>
    </button>
  ))}
</div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: c.divider }} />
          <span className="text-[10.5px] sm:text-[11px] text-center shrink-0" style={{ color: c.dividerText }}>
            or sign in with email
          </span>
          <div className="flex-1 h-px" style={{ background: c.divider }} />
        </div>

        {/* Error */}
        {serverError && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-[12.5px]"
            style={{ background: c.errorBg, border: `1px solid ${c.errorBorder}`, color: c.errorText }}
          >
            <svg className="h-4 w-4 shrink-0 mt-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
            </svg>
            <span className="break-words">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium" style={{ color: c.subtext }}>Email address</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] pointer-events-none"
                style={{ color: c.placeholder }}
              />
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                inputMode="email"
                className="w-full rounded-[9px] pl-9 pr-4 py-2.5 text-[13px] outline-none focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)] transition-all"
                style={{
                  background: c.inputBg,
                  border: `1px solid ${c.border}`,
                  color: c.text,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
              />
            </div>
            {errors.email && <p className="text-[11.5px]" style={{ color: c.errorText }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label className="text-[12px] font-medium" style={{ color: c.subtext }}>Password</label>
              <a href="/auth/forgot-password" className="text-[11.5px] text-[#10B981] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] pointer-events-none"
                style={{ color: c.placeholder }}
              />
              <input
                {...register("password")}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-[9px] pl-9 pr-10 py-2.5 text-[13px] outline-none focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)] transition-all"
                style={{
                  background: c.inputBg,
                  border: `1px solid ${c.border}`,
                  color: c.text,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: c.placeholder }}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11.5px]" style={{ color: c.errorText }}>{errors.password.message}</p>}
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
            <span className="text-[12px]" style={{ color: c.subtext }}>Keep me signed in on this device</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-[13.5px] sm:text-[14px] font-semibold text-white disabled:opacity-60 transition-all hover:shadow-[0_4px_28px_rgba(16,185,129,0.38)] hover:-translate-y-px active:translate-y-0"
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

        <p className="mt-5 text-center text-[12.5px]" style={{ color: c.subtext }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#10B981] hover:underline">Request access </a>  ||   <a href="/" className="text-[#10B981] hover:underline"> Home</a>
        </p>     
      </div>
    </div>
  );
}