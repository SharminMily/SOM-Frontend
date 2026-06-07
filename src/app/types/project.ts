export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}