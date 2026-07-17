"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { departmentApi } from "@/lib/api/department.api";
import { userApi } from "@/lib/api/user.api";

import { toast } from "sonner";

export default function DepartmentDialog({
  onSuccess,
  editData = null,
}: any) {
  const isEdit = !!editData;

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headId: "",
  });

// FETCH USERS —

useEffect(() => {
  if (!open) return;

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Couldn't load users");
    }
  };

  fetchUsers();
}, [open]);

  // LOAD EDIT DATA — dialog 
  useEffect(() => {
    if (!open) return;

    if (isEdit && editData) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        headId: editData.headId || editData.head?.id || "",
      });
    } else {
      setFormData({ name: "", description: "", headId: "" });
      setSearch("");
    }
  }, [open, isEdit, editData]);

  // users load
  useEffect(() => {
    if (open && isEdit && formData.headId && users.length > 0) {
      const currentHead = users.find((u) => u.id === formData.headId);
      if (currentHead) {
        setSearch(currentHead.email);
      }
    }
  }, [open, isEdit, users, formData.headId]);

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // SUBMIT
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      headId: formData.headId || undefined, // খালি স্ট্রিং backend এ পাঠানো হবে না
    };

    try {
      setLoading(true);

      if (isEdit) {
        await departmentApi.updateDepartments(editData.id, payload);
        toast.success("Department updated successfully");
      } else {
        await departmentApi.createDepartments(payload);
        toast.success("Department created successfully");
      }

      setOpen(false);
      setFormData({ name: "", description: "", headId: "" });
      setSearch("");

      onSuccess?.();
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline">
            Edit
          </Button>
        ) : (
          <Button>+ Add Department</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Department" : "Create Department"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* NAME */}
          <div>
            <Label className="pb-2">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label className="pb-2">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* MANAGER SEARCH */}
          <div className="relative">
            <Label className="pb-2">Manager (Email)</Label>

            <Input
              placeholder="Search email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // 
                setFormData((p) => ({ ...p, headId: "" }));
              }}
            />

            {formData.headId && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected — clear text to search someone else
              </p>
            )}

            {search && !formData.headId && (
              <div className="border rounded-md max-h-40 overflow-auto mt-1">
                {filteredUsers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No user found
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setFormData((p) => ({
                          ...p,
                          headId: u.id,
                        }));
                        setSearch(u.email);
                      }}
                      className="p-2 hover:bg-muted cursor-pointer text-sm"
                    >
                      {u.firstName} {u.lastName} — {u.email}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}