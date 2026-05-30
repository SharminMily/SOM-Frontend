"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  Briefcase,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    icon: Users,
  },
  {
    title: "Projects",
    icon: Briefcase,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>

      <SidebarContent>

        <SidebarGroup>

          <SidebarGroupLabel>
            SOM
          </SidebarGroupLabel>

          <SidebarGroupContent>

            <SidebarMenu>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>

                  <SidebarMenuButton asChild>
                    <button>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>

                </SidebarMenuItem>
              ))}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

    </Sidebar>
  );
}