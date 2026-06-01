import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole   = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  joinedDate?: string;
  departmentId?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── State & actions ──────────────────────────────────────────────────────────

interface AuthState {
  // State
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;          // true while /auth/refresh is in-flight on page load

  // Actions
  setAuth: (user: AuthUser, accessToken: string) => void;
  setToken: (accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  clearAuth: () => void;       // silent clear (no redirect) — used by interceptor
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

const ROLE_DASHBOARD: Record<UserRole, string> = {
  ADMIN:    "/dashboard/admin", 
  MANAGER:  "/dashboard/manager",
  EMPLOYEE: "/dashboard/employee",
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Initial state ──────────────────────────────────────────────────
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: true,          // assume loading until first refresh resolves

        // ── setAuth ────────────────────────────────────────────────────────
        // Called after successful login or refresh.
        setAuth: (user, accessToken) =>
          set(
            { user, accessToken, isAuthenticated: true, isLoading: false },
            false,
            "auth/setAuth"
          ),

        // ── setToken ───────────────────────────────────────────────────────
        // Called when the Axios interceptor silently refreshes the token.
        setToken: (accessToken) =>
          set({ accessToken }, false, "auth/setToken"),

        // ── setUser ────────────────────────────────────────────────────────
        // Called after profile update so the navbar/sidebar reflect new data.
        setUser: (user) =>
          set({ user }, false, "auth/setUser"),

        // ── setLoading ─────────────────────────────────────────────────────
        setLoading: (isLoading) =>
          set({ isLoading }, false, "auth/setLoading"),

        // ── logout ─────────────────────────────────────────────────────────
        // Calls the API to clear the httpOnly cookie, wipes local state,
        // then redirects to login.
        logout: () => {
          // Fire-and-forget — we don't await because we redirect immediately.
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/auth/logout`,
            { method: "POST", credentials: "include" }
          ).catch(() => {});

          set(
            { user: null, accessToken: null, isAuthenticated: false, isLoading: false },
            false,
            "auth/logout"
          );

          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        },

        // ── clearAuth ──────────────────────────────────────────────────────
        // Silent clear used by the Axios interceptor when a refresh fails.
        // Does NOT redirect — the caller handles navigation.
        clearAuth: () =>
          set(
            { user: null, accessToken: null, isAuthenticated: false, isLoading: false },
            false,
            "auth/clearAuth"
          ),
      }),
      {
        name: "som-auth",
        // Only persist the non-sensitive, stable parts.
        // The access token is intentionally NOT persisted (memory-only for XSS safety).
        // On page reload, the token is restored via /auth/refresh using the httpOnly cookie.
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "SOM / auth" }
  )
);

// ─── Derived selectors ────────────────────────────────────────────────────────
// Use these in components instead of selecting the whole store to avoid
// unnecessary re-renders.

/** Current authenticated user (or null). */
export const selectUser = (s: AuthState) => s.user;

/** Raw access token — used by the Axios interceptor. */
export const selectToken = (s: AuthState) => s.accessToken;

/** True while the initial session restore is in-flight. */
export const selectIsLoading = (s: AuthState) => s.isLoading;

/** True once a valid session has been confirmed. */
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;

/** Full name derived from first + last. */
export const selectFullName = (s: AuthState) =>
  s.user ? `${s.user.firstName} ${s.user.lastName}` : "";

/** User's role, or null if not authenticated. */
export const selectRole = (s: AuthState): UserRole | null => s.user?.role ?? null;

/** The dashboard route for the current user's role. */
export const selectDashboardRoute = (s: AuthState): string => {
  const role = s.user?.role;
  return role ? ROLE_DASHBOARD[role] : "/auth/login";
};

/** Initials for avatar placeholders. */
export const selectInitials = (s: AuthState): string => {
  if (!s.user) return "?";
  return `${s.user.firstName[0] ?? ""}${s.user.lastName[0] ?? ""}`.toUpperCase();
};

// ─── Role guards (use in components / pages) ─────────────────────────────────

export const selectIsAdmin    = (s: AuthState) => s.user?.role === "ADMIN";
// export const selectIsHR       = (s: AuthState) => s.user?.role === "HR";
export const selectIsManager  = (s: AuthState) => s.user?.role === "MANAGER";
export const selectIsEmployee = (s: AuthState) => s.user?.role === "EMPLOYEE";

/** True for ADMIN or HR — can manage people/payroll. */
export const selectCanManagePeople = (s: AuthState) =>
  s.user?.role === "ADMIN" ;

/** True for ADMIN or MANAGER — can manage projects/tasks. */
export const selectCanManageProjects = (s: AuthState) =>
  s.user?.role === "ADMIN" || s.user?.role === "MANAGER";

/** True for any role that can approve leave. */
export const selectCanApproveLeave = (s: AuthState) =>
  s.user?.role === "ADMIN" || s.user?.role === "MANAGER";