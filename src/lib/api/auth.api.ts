import api from "./axios";

// ─── Payload types ────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ─── Response types ───────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
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

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

// Standard API envelope: { success, message, data }
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * POST /auth/login
   * Returns access token (store in memory) + sets httpOnly refresh cookie.
   */
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", payload),


  /**
   * POST /auth/signup
   * Registers a new user. Triggers verification email.
   */
  signup: (payload: SignupPayload) =>
    api.post<ApiResponse<MessageResponse>>("/auth/signup", payload),

  /**
   * POST /auth/logout
   * Clears the httpOnly refresh cookie and blacklists the token server-side.
   */
  logout: () =>
    api.post<ApiResponse<MessageResponse>>("/auth/logout"),

  /**
   * POST /auth/refresh
   * Uses the httpOnly refresh cookie to issue a new access token.
   * Called on every page load and on 401 errors by the Axios interceptor.
   */
  refresh: () =>
    api.post<ApiResponse<RefreshResponse>>("/auth/refresh"),

  /**
   * POST /auth/forgot-password
   * Sends a 6-digit OTP to the user's email for password reset.
   */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<ApiResponse<MessageResponse>>("/auth/forgot-password", payload),

  /**
   * POST /auth/reset-password
   * Validates the OTP and sets a new password.
   */
  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<ApiResponse<MessageResponse>>("/auth/reset-password", payload),

  /**
   * PATCH /auth/change-password
   * Changes password for the currently authenticated user.
   * Requires the current password for verification.
   */
  changePassword: (payload: ChangePasswordPayload) =>
    api.patch<ApiResponse<MessageResponse>>("/auth/change-password", payload),

  /**
   * GET /auth/verify-email/:token
   * Activates the account using the token from the verification email.
   */
  verifyEmail: (token: string) =>
    api.get<ApiResponse<MessageResponse>>(`/auth/verify-email/${token}`),
};