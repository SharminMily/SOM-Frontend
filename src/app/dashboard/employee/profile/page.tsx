"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/lib/api/user.api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  joinedDate?: string;

  department?: {
    name: string;
  };

  manager?: {
    firstName: string;
    lastName: string;
  };
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatarUrl: "",
  });

const loadProfile = async () => {
  try {
    setLoading(true);

    const res = await userApi.getMyProfile();

    setUser(res.data);

    setForm({
      firstName: res.data.firstName || "",
      lastName: res.data.lastName || "",
      phone: res.data.phone || "",
      avatarUrl: res.data.avatarUrl || "",
    });
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to load profile"
    );
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadProfile();
  }, []);

const handleUpdate = async () => {
  try {
    setSaving(true);

    const res = await userApi.updateMyProfile(form);

    toast.success(
      res.message || "Profile updated successfully"
    );

    await loadProfile();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to update profile"
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl p-6">

      <Card className="rounded-3xl">

        <CardContent className="p-8">

          <div className="grid gap-10 lg:grid-cols-[250px_1fr]">

            {/* Left */}

            <div className="space-y-5 text-center">

              <Avatar className="mx-auto h-36 w-36">

                <AvatarImage src={form.avatarUrl} />

                <AvatarFallback>
                  {user.firstName.charAt(0)}
                </AvatarFallback>

              </Avatar>

              <div>

                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="text-muted-foreground">
                  {user.email}
                </p>

              </div>

              <Badge>{user.role}</Badge>

              <Badge variant="secondary">
                {user.status}
              </Badge>

            </div>

            {/* Right */}

            <div className="space-y-5">

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    First Name
                  </label>

                  <Input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        firstName: e.target.value,
                      })
                    }
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Last Name
                  </label>

                  <Input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lastName: e.target.value,
                      })
                    }
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Phone
                  </label>

                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Avatar URL
                  </label>

                  <Input
                    value={form.avatarUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        avatarUrl: e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              <div className="grid gap-4 rounded-xl border p-5 md:grid-cols-2">

                <div>
                  <p className="text-muted-foreground text-sm">
                    Department
                  </p>

                  <p className="font-medium">
                    {user.department?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Manager
                  </p>

                  <p className="font-medium">
                    {user.manager
                      ? `${user.manager.firstName} ${user.manager.lastName}`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Email Verified
                  </p>

                  <p className="font-medium">
                    {user.emailVerified ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Joined
                  </p>

                  <p className="font-medium">
                    {user.joinedDate
                      ? new Date(user.joinedDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

              </div>

              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full md:w-auto"
              >
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}