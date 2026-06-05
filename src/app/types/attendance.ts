export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "ON_LEAVE";

export interface AttendanceUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Attendance {
  id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  note?: string | null;
  createdAt: string;

  userId: string;
  user: AttendanceUser;
}