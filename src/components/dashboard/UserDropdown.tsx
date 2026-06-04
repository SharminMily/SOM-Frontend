"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface Props {
  name: string;
  role: string;
  image?: string;
}

export default function UserDropdown({
  name,
  role,
  image,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={image} />
        <AvatarFallback>
          {name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <p className="text-sm font-medium">{name}</p>

        <p className="text-xs text-muted-foreground">
          {role}
        </p>
      </div>
    </div>
  );
}