"use client";

import React, { useEffect, useState } from "react";
import { departmentApi } from "@/lib/api/department.api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2, Search } from "lucide-react";
import DepartmentDialog from "@/components/department/DepartmentDialog";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentApi.getAlldepartments();
      setDepartments(res.data || []);
    } catch (error) {
      toast.error("Couldn't load departments. Retry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  /* DELETE — confirmation সহ */
  const handleDelete = (id: string, name: string) => {
     if (!id) {
    toast.error("Invalid department — missing ID");
    console.error("Department id is missing:", { id, name });
    return;
  }
    toast(`Delete "${name}"?`, {
      description: "This department will be permanently removed.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await departmentApi.departmentIdDelete(id);
            setDepartments((prev) => prev.filter((d) => d.id !== id));
            toast.success("Department deleted successfully");
          } catch (err) {
            toast.error("Failed to delete department");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage all departments</p>
        </div>

        <DepartmentDialog onSuccess={fetchDepartments} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search department..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>

                    <TableCell className="font-medium">
                      {dept.name}
                    </TableCell>

                    <TableCell>{dept.description}</TableCell>

                    <TableCell>
                      {dept.head ? (
                        <Badge>
                          {dept.head.firstName} {dept.head.lastName}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Assigned</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {dept.users?.length || 0}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <DepartmentDialog
                        editData={dept}
                        onSuccess={fetchDepartments}
                      />

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(dept.id, dept.name)}
                      >
                        Delete
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredDepartments.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No departments found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}