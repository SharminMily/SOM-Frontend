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

  // LOAD EDIT DATA
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        headId: editData.headId || "",
      });
    }
  }, [editData]);

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await userApi.getAllUsers();
      setUsers(res.data || []);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isEdit) {
        await departmentApi.updateDepartments(
          editData.id,
          formData
        );

        toast.success("Department updated successfully");
      } else {
        await departmentApi.createDepartments(formData);

        toast.success("Department created successfully");
      }

      setOpen(false);
      setFormData({
        name: "",
        description: "",
        headId: "",
      });
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
            <Label>Name</Label>
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
            <Label>Description</Label>
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
          <div>
            <Label>Manager (Email)</Label>

            <Input
              placeholder="Search email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <div className="border rounded-md max-h-40 overflow-auto">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        headId: u.id,
                      }));

                      setSearch(u.email);
                    }}
                    className="p-2 hover:bg-muted cursor-pointer"
                  >
                    {u.email}
                  </div>
                ))}
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