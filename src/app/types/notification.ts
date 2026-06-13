export interface Notification {
  id: string;
  title: string;
  message: string;

  type:
    | "LEAVE_STATUS"
    | "TASK_ASSIGNED"
    | "ANNOUNCEMENT"
    | "PAYSLIP_READY"
    | "SYSTEM";

  isRead: boolean;

  refId?: string;

  createdAt: string;
}