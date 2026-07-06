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
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Search, Pencil, Trash2, Loader2 } from "lucide-react";

import { userApi } from "@/lib/api/user.api";

export default function AllEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  // console.log("employees",employees);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* FETCH USERS */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAllUsers();
      setEmployees(res.data || []);
    } catch (err) {
      // console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* DELETE USER */
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure to delete?");
    if (!confirm) return;

    try {
      await userApi.getUserIdDelete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      // console.log(err);
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

        <Button>+ Add Employee</Button>
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

                      <Button size="sm" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(emp.id)}
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

    </div>
  );
}