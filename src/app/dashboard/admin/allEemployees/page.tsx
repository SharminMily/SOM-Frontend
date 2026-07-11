"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { userApi } from "@/lib/api/user.api";
import { departmentApi } from "@/lib/api/department.api";

export default function AllEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  console.log(departments);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* EDIT STATE */
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
    status: "",
    departmentId: "",
  });

  /* FETCH USERS */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAllUsers();
      setEmployees(res.data || []);
    } catch (err) {
      toast.error("Couldn't load employees. Retry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* FETCH DEPARTMENTS */
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentApi.getAlldepartments();
        setDepartments(res.data || []);
      } catch (err) {
        toast.error("Couldn't load departments");
      }
    };
    fetchDepartments();
  }, []);

  /* DELETE USER */
  const handleDelete = (id: string, name: string) => {
    toast("Delete this employee?", {
      description: `${name} will be permanently removed.`,
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await userApi.getUserIdDelete(id);
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            toast.success("Employee deleted");
          } catch (err) {
            toast.error("Couldn't delete employee. Retry");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  /* OPEN EDIT DIALOG (একটাই, duplicate মুছে দিলাম) */
  const handleEditOpen = (emp: any) => {
    setEditingUser(emp);
    setEditForm({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      role: emp.role || "",
      status: emp.status || "",
      departmentId: emp.departmentId || emp.department?.id || "",
    });
    setEditOpen(true);
  };

  /* SAVE EDIT */
const handleEditSave = async () => {
  if (!editingUser) return;

  try {
    setEditSaving(true);
    await userApi.updateUser(editingUser.id, editForm);

    toast.success("Employee updated");
    setEditOpen(false);
    setEditingUser(null);

    await fetchUsers(); // পুরো list fresh data দিয়ে reload
  } catch (err) {
    toast.error("Couldn't update employee. Retry");
  } finally {
    setEditSaving(false);
  }
};
  /* SEARCH */
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">
            Manage all employees in your organization
          </p>
        </div>

        <Button>Add employee</Button>
      </div>

      {/* SEARCH */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>

        <CardContent>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <Table>

              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-muted/50">

                    {/* NAME */}
                    <TableCell className="font-medium">
                      {emp.firstName} {emp.lastName}
                    </TableCell>

                    {/* EMAIL */}
                    <TableCell>{emp.email}</TableCell>

                    {/* ROLE */}
                    <TableCell>
                      <Badge variant="outline">
                        {emp.role}
                      </Badge>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        variant={
                          emp.status === "ACTIVE"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>

                    {/* DEPARTMENT */}
                    <TableCell>
                     {emp.department?.name || "N/A"}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right space-x-2">

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditOpen(emp)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>

            </Table>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredEmployees.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No employees found
            </div>
          )}

        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                  <SelectItem value="MANAGER">MANAGER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
             <Select
  value={editForm.departmentId || "unassigned"}
  onValueChange={(value) =>
    setEditForm((prev) => ({
      ...prev,
      departmentId: value === "unassigned" ? "" : value,
    }))
  }
>
  <SelectTrigger id="department">
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="unassigned">No department</SelectItem>
    {departments
      .filter((dept) => dept.id) // খালি/undefined id বাদ
      .map((dept) => (
        <SelectItem key={dept.id} value={dept.id}>
          {dept.name}
        </SelectItem>
      ))}
  </SelectContent>
</Select>
            </div>

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={editSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={editSaving}>
              {editSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save changes
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}