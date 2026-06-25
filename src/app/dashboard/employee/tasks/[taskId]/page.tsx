"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { taskApi } from "@/lib/api/task.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

export default function EmployeeTaskDetailsPage() {
  const params = useParams();

  const taskId = params.taskId as string;

  const [task, setTask] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTask = async () => {
    try {
      const [taskRes, commentsRes] = await Promise.all([
        taskApi.getTaskById(taskId),
        taskApi.getTaskComments(taskId),
      ]);

      setTask(taskRes.data);
      setStatus(taskRes.data.status);

      setComments(commentsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const handleStatusUpdate = async () => {
    try {
      await taskApi.updateTaskStatus(
        taskId,
        status
      );

      loadTask();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await taskApi.addComment(taskId, {
        content: comment,
      });

      setComment("");

      loadTask();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!task) {
    return (
      <div className="p-6">
        Task not found
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* TASK INFO */}

      <Card>
        <CardHeader>
          <CardTitle>
            {task.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>
            {task.description ||
              "No description"}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge>
              {task.status}
            </Badge>

            <Badge variant="outline">
              {task.priority}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Due:
            {" "}
            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* UPDATE STATUS */}

      <Card>
        <CardHeader>
          <CardTitle>
            Update Status
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 md:flex-row">
          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="TODO">
                To Do
              </SelectItem>

              <SelectItem value="IN_PROGRESS">
                In Progress
              </SelectItem>

              <SelectItem value="IN_REVIEW">
                In Review
              </SelectItem>

              <SelectItem value="DONE">
                Done
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={
              handleStatusUpdate
            }
          >
            Update Status
          </Button>
        </CardContent>
      </Card>

      {/* ADD COMMENT */}

      <Card>
        <CardHeader>
          <CardTitle>
            Add Comment
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write comment..."
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
          />

          <Button
            onClick={handleComment}
          >
            Send Comment
          </Button>
        </CardContent>
      </Card>

      {/* COMMENTS */}

      <Card>
        <CardHeader>
          <CardTitle>
            Comments
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No comments yet
            </p>
          ) : (
            comments.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border p-3"
              >
                <div className="font-medium">
                  {item.user
                    ?.firstName}{" "}
                  {
                    item.user
                      ?.lastName
                  }
                </div>

                <div className="mt-1 text-sm">
                  {item.content}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}