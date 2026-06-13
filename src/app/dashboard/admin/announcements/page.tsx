"use client";

import { useEffect, useState } from "react";

import { notificationApi } from "@/lib/api/notification.api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function AnnouncementsPage() {
  const [data, setData] = useState<Announcement[]>([]);
  console.log("data", data);

  const loadData = async () => {
    const res = await notificationApi.getAnnouncements();
    setData(res.data.notifications);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-4">

      <h1 className="text-3xl font-bold">
        Announcements
      </h1>

      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex justify-between">

              <CardTitle>
                {item.title}
              </CardTitle>

              <Badge>
                Announcement
              </Badge>

            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              {item.message}
            </p>

            <p className="text-xs mt-2 text-muted-foreground">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}

    </div>
  );
}