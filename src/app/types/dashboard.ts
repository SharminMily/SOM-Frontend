export interface DashboardData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    role: string;
    status: string;
    emailVerified: boolean;
    joinedDate?: string;

    department?: {
      id: string;
      name: string;
    } | null;

    manager?: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
  };

  stats: {
    totalProjects: number;
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    reviewTasks: number;
    completedTasks: number;
    unreadNotifications: number;
  };

  attendance: any;
  tasks: any;
  projects: any[];
  leave: any;
  payroll: any;
  notifications: any[];
  announcements: any[];
}