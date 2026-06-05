export type UserRole = "admin" | "manager" | "employee";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type TUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  departmentId?: string;
  managerId?: string;
  role?: UserRole;           // Optional, defaults to EMPLOYEE
}
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string;
  managerId?: string;
  role?: UserRole;
  status?: UserStatus;
}

export const publicUserSelectFields = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  role: true,
  status: true,
  departmentId: true,
  managerId: true,
  joinedDate: true,
  createdAt: true,
  updatedAt: true,
  // excluded: password
} as const;

