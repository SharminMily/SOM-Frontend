"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
    DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { notificationApi } from "@/lib/api/notification.api";

interface Props {
  notification?: any;
  onSuccess: () => void;
}

export default function NotificationDialog({
  notification,
  onSuccess,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [title, setTitle] =
    useState(notification?.title || "");

  const [message, setMessage] =
    useState(notification?.message || "");

  const [type, setType] =
    useState(
      notification?.type ||
        "ANNOUNCEMENT"
    );

const handleSubmit = async () => {
  try {
    if (!title || !message) {
      alert("Title and message required");
      return;
    }

    console.log("Submitting notification:", {
      title,
      message,
      type,
    });

    if (notification) {
      await notificationApi.updateNotification(notification.id, {
        title,
        message,
        type,
      });
    } else {
      await notificationApi.createNotification({
        userId: "", // For now, we can leave this empty or set it to a specific user ID
        title,
        message,
        type,
      });
    }

    alert("Notification saved successfully ✅");

    setOpen(false);
    onSuccess();
  } catch (error) {
    console.error(error);
    alert("Failed to save notification ❌");
  }
};


  return (
    <Dialog
      open={open}
      onOpenChange={
        setOpen
      }
    >
      <DialogTrigger
        asChild
      >
        <Button>
          {notification
            ? "Edit"
            : "Create Notification"}
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            {notification
              ? "Edit Notification"
              : "Create Notification"}
          </DialogTitle>
   <DialogDescription>
      Send notification to selected user
    </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <Textarea
            placeholder="Message"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
          />

          <Select
            value={type}
            onValueChange={
              setType
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="ANNOUNCEMENT">
                Announcement
              </SelectItem>

              <SelectItem value="TASK_ASSIGNED">
                Task Assigned
              </SelectItem>

              <SelectItem value="TASK_COMPLETED">
                Task Completed
              </SelectItem>

              <SelectItem value="LEAVE_REQUEST">
                Leave Request
              </SelectItem>

              <SelectItem value="LEAVE_APPROVED">
                Leave Approved
              </SelectItem>

              <SelectItem value="LEAVE_REJECTED">
                Leave Rejected
              </SelectItem>

              <SelectItem value="PROJECT">
                Project
              </SelectItem>

              <SelectItem value="SYSTEM">
                System
              </SelectItem>

            </SelectContent>

          </Select>

          <Button
            className="w-full"
            onClick={
              handleSubmit
            }
          >
            Save
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}