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
  avatarUrl?: string;
}



export default function UserDropdown({ name, role, image, avatarUrl }: Props) {
  // console.log("UserDropdown props:", { name, role, image, avatarUrl });

  return (
    <div className="flex items-center gap-3">
      {/* <Avatar>
        <AvatarImage src={avatarUrl || image} />
        <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar> */}

      <div>
        {/* <p className="text-sm font-medium">{name}</p> */}
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}