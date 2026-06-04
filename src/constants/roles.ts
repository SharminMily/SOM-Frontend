export const USER_ROLE = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRole =
  (typeof USER_ROLE)[keyof typeof USER_ROLE];