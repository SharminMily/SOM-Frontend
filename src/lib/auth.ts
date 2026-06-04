import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ✅ await here
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.data;
}