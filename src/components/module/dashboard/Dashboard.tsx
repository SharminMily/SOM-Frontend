// import { getCurrentUser } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export default async function Dashboard() {
//   const user = await getCurrentUser();

//   if (user.role === "ADMIN") {
//     redirect("/dashboard/admin");
//   }

//   if (user.role === "MANAGER") {
//     redirect("/dashboard/manager");
//   }

//   redirect("/dashboard/employee");
// }