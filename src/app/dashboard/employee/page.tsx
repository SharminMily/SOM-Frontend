"use client";


"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/lib/store/task.store";

export default function TaskDetailPage() {
  const params = useParams();
  const { selectedTask, fetchTaskById, updateStatus } = useTaskStore();

  useEffect(() => {
    fetchTaskById(params.id as string);
  }, [params.id]);

  if (!selectedTask) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">

      <Card>
        <CardContent className="p-4 space-y-2">

          <h1 className="text-2xl font-bold">
            {selectedTask.title}
          </h1>

          <p className="text-gray-500">
            {selectedTask.description || "No description"}
          </p>

          <p>Status: {selectedTask.status}</p>

          <div className="flex gap-2">

            <Button
              onClick={() =>
                updateStatus(selectedTask.id, "IN_PROGRESS")
              }
            >
              Start
            </Button>

            <Button
              onClick={() =>
                updateStatus(selectedTask.id, "DONE")
              }
            >
              Mark Done
            </Button>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}




// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { CheckCircle, Clock, Folder, Bell, Calendar } from "lucide-react";

// export default function EmployeeDashboard() {
//   return (
//     <div className="p-6 space-y-6">

//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Employee Dashboard</h1>
//           <p className="text-muted-foreground">
//             Welcome back! Here’s your daily overview.
//           </p>
//         </div>

//         <Button>Clock In</Button>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm">Today Attendance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="text-green-500" />
//               <span className="font-medium">Present</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm">Pending Tasks</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <Clock className="text-orange-500" />
//               <span className="font-medium">5 Tasks</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm">Active Projects</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <Folder className="text-blue-500" />
//               <span className="font-medium">3 Projects</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm">Leave Balance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <Calendar className="text-purple-500" />
//               <span className="font-medium">12 Days</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* MAIN TABS */}
//       <Tabs defaultValue="tasks" className="space-y-4">

//         <TabsList>
//           <TabsTrigger value="tasks">My Tasks</TabsTrigger>
//           <TabsTrigger value="projects">Projects</TabsTrigger>
//           <TabsTrigger value="attendance">Attendance</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//         </TabsList>

//         {/* TASKS */}
//         <TabsContent value="tasks">
//           <Card>
//             <CardHeader>
//               <CardTitle>My Tasks</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">

//               {[1, 2, 3].map((t) => (
//                 <div
//                   key={t}
//                   className="flex items-center justify-between border p-3 rounded-lg"
//                 >
//                   <div>
//                     <p className="font-medium">Build Dashboard UI</p>
//                     <p className="text-sm text-muted-foreground">
//                       Due: 10 June 2026
//                     </p>
//                   </div>

//                   <Badge>IN_PROGRESS</Badge>
//                 </div>
//               ))}

//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* PROJECTS */}
//         <TabsContent value="projects">
//           <Card>
//             <CardHeader>
//               <CardTitle>My Projects</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">

//               {[1, 2].map((p) => (
//                 <div key={p} className="space-y-2 border p-3 rounded-lg">

//                   <div className="flex justify-between">
//                     <p className="font-medium">Ghorer Fix</p>
//                     <Badge>ACTIVE</Badge>
//                   </div>

//                   <Progress value={60} />
//                 </div>
//               ))}

//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ATTENDANCE */}
//         <TabsContent value="attendance">
//           <Card>
//             <CardHeader>
//               <CardTitle>Attendance Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <p>Today: Present</p>
//               <p>This Month: 22 Present / 2 Absent</p>
//               <Button variant="outline">View Full Report</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* NOTIFICATIONS */}
//         <TabsContent value="notifications">
//           <Card>
//             <CardHeader>
//               <CardTitle>Notifications</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-3">

//               {[1, 2, 3].map((n) => (
//                 <div key={n} className="border p-3 rounded-lg">
//                   <p className="font-medium">Task Assigned</p>
//                   <p className="text-sm text-muted-foreground">
//                     You got a new task from your manager
//                   </p>
//                 </div>
//               ))}

//             </CardContent>
//           </Card>
//         </TabsContent>

//       </Tabs>
//     </div>
//   );
// }