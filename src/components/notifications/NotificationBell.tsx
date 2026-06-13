"use client";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface Props {
  count: number;
}

export default function NotificationBell({
  count,
}: Props) {
  return (
    <div className="relative">
      <Bell className="h-6 w-6" />

      {count > 0 && (
        <Badge
          className="
          absolute
          -top-2
          -right-2
          rounded-full
          h-5
          w-5
          p-0
          flex
          items-center
          justify-center
          "
        >
          {count}
        </Badge>
      )}
    </div>
  );
}