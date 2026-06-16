import { USER_ROLE } from "@/constants/roles";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  UsersRound,
  ListTodo,
  User,
  ShieldCheck,
  FolderKanban,
  CalendarDays,
  Bell,
  House,
  Building2,
  CalendarCheck,
  CalendarX,
  DollarSign,
  Megaphone,
  Settings,
} from "lucide-react";




export const sidebarItems = {
  [USER_ROLE.ADMIN]: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },

    // 👥 USER MANAGEMENT
    {
      title: "Employees",
      href: "/dashboard/admin/allEemployees",
      icon: Users,
    },
    // {
    //   title: "Managers",
    //   href: "/dashboard/admin/managers",
    //   icon: UserCog,
    // },

    // 🏢 ORGANIZATION
    {
      title: "Departments",
      href: "/dashboard/admin/departments",
      icon: Building2,
    },

    // 📋 TASK MANAGEMENT

    {
      title: "Projects",
      href: "/dashboard/admin/projects",
      icon: FolderKanban,
    },

    // 🔔 SYSTEM
    {
      title: "Notifications",
      href: "/dashboard/admin/notifications",
      icon: Bell,
    },
    {
      title: "Announcements",
      href: "/dashboard/admin/announcements",
      icon: Megaphone,
    },

    //   {
    //   title: "Tasks",
    //   href: "/dashboard/admin/tasks",
    //   icon: ListTodo,
    // },

    // ⏱ ATTENDANCE
    {
      title: "Attendance",
      href: "/dashboard/admin/attendance",
      icon: CalendarCheck,
    },

    // 🏖 LEAVE MANAGEMENT
    {
      title: "Leave Requests",
      href: "/dashboard/admin/leaves",
      icon: CalendarX,
    },

    // 💰 PAYROLL
    {
      title: "Payroll",
      href: "/dashboard/admin/payroll",
      icon: DollarSign,
    },

    // 📊 REPORTS
    {
      title: "Reports",
      href: "/dashboard/admin/reports",
      icon: FileText,
    },



    // // ⚙️ SETTINGS
    // {
    //   title: "Settings",
    //   href: "/dashboard/admin/settings",
    //   icon: Settings,
    // },
  ],

  [USER_ROLE.MANAGER]: [
    {
      title: "Dashboard",
      href: "/dashboard/manager",
      icon: LayoutDashboard,
    },
    {
      title: "Team",
      href: "/dashboard/manager/team",
      icon: UsersRound,
    },
    {
      title: "Tasks",
      href: "/dashboard/manager/tasks",
      icon: ListTodo,
    },
  ],

  [USER_ROLE.EMPLOYEE]: [
    {
      title: "Dashboard",
      href: "/dashboard/employee",
      icon: LayoutDashboard,
    },
    {
      title: "My Tasks",
      href: "/dashboard/employee/tasks",
      icon: ListTodo,
    },
    {
      title: "My Projects",
      href: "/dashboard/employee/projects",
      icon: FolderKanban,
    },
    {
      title: "Attendance",
      href: "/dashboard/employee/attendance",
      icon: ShieldCheck,
    },
    {
      title: "Leave Requests",
      href: "/dashboard/employee/leaveRequest",
      icon: CalendarDays,
    },
    {
      title: "Notifications",
      href: "/dashboard/employee/notifications",
      icon: Bell,
    },
    {
      title: "Profile",
      href: "/dashboard/employee/profile",
      icon: User,
    },
    {
      title: "Home",
      href: "/",
      icon: House,
    },
  ]
};