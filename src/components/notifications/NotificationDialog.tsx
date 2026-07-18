// components/notifications/NotificationDialog.tsx
"use client";

import { useState } from "react";
import { Plus, Pencil, Send } from "lucide-react";

import {
  notificationApi,
  NotificationType,
  TBroadcastTarget,
  Role,
} from "@/lib/api/notification.api";
import { Notification } from "@/app/types/notification";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const NOTIFICATION_TYPES: NotificationType[] = [
  "LEAVE_STATUS",
  "TASK_ASSIGNED",
  "ANNOUNCEMENT",
  "PAYSLIP_READY",
  "SYSTEM",
];

const ROLES: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

interface NotificationDialogProps {
  notification?: Notification; // দিলে Edit mode, না দিলে Create mode
  onSuccess: () => void;
}

export default function NotificationDialog({
  notification,
  onSuccess,
}: NotificationDialogProps) {
  const isEdit = !!notification;

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState(notification?.title || "");
  const [message, setMessage] = useState(notification?.message || "");
  const [type, setType] = useState<NotificationType>(
    (notification?.type as NotificationType) || "ANNOUNCEMENT"
  );

  // শুধু create mode-এর জন্য
  const [target, setTarget] = useState<TBroadcastTarget>("ROLE");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("ANNOUNCEMENT");
    setTarget("ROLE");
    setSelectedRoles([]);
  };

  const toggleRole = (role: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    if (!isEdit && target === "ROLE" && selectedRoles.length === 0) {
      return; 
    }

    try {
      setSubmitting(true);

      if (isEdit && notification) {
        await notificationApi.updateNotification(notification.id, {
          title,
          message,
          type,
        });
      } else if (target === "ALL") {
        await notificationApi.createBroadcastNotification({
          title,
          message,
          type,
          target: "ALL",
        });
      } else {
        await notificationApi.createBroadcastNotification({
          title,
          message,
          type,
          target: "ROLE",
          roles: selectedRoles,
        });
      }

      setOpen(false);
      resetForm();
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v && !isEdit) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline">
            <Pencil className="h-3 w-3" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Notification
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Notification" : "Send Notification"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* TARGET SELECT — শুধু create mode-এ */}
          {!isEdit && (
            <div className="space-y-2">
              <Label>Send To</Label>
              <Select
                value={target}
                onValueChange={(v) => setTarget(v as TBroadcastTarget)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLE">By Role</SelectItem>
                  <SelectItem value="ALL">All Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ROLE CHECKBOXES — শুধু target === ROLE হলে */}
          {!isEdit && target === "ROLE" && (
            <div className="space-y-2">
              <Label>Select Role(s)</Label>
              <div className="flex flex-col gap-2 rounded-lg border p-3">
                {ROLES.map((role) => (
                  <div key={role} className="flex items-center gap-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={() => toggleRole(role)}
                    />
                    <Label
                      htmlFor={`role-${role}`}
                      className="cursor-pointer font-normal"
                    >
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedRoles.length === 0 && (
                <p className="text-xs text-destructive">
                  select at least one role to send notification.
                </p>
              )}
            </div>
          )}

          {/* TYPE */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as NotificationType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
            />
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            <Send className="mr-2 h-4 w-4" />
            {submitting ? "Sending..." : isEdit ? "Update" : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}