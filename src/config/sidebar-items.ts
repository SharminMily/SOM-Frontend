import { USER_ROLE } from "@/constants/roles";
import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  UsersRound,
  ListTodo,
  User,
} from "lucide-react";




export const sidebarItems = {
[USER_ROLE.ADMIN]: [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    href: "/dashboard/admin/employees",
    icon: Users,
  },
  {
    title: "Managers",
    href: "/dashboard/admin/managers",
    icon: UserCog,
  },
  {
    title: "Reports",
    href: "/dashboard/admin/reports",
    icon: FileText,
  },
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
    title: "Profile",
    href: "/dashboard/employee/profile",
    icon: User,
  },
],
};