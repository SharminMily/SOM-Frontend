// lib/auth.ts
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  console.log("Token from cookie:", token ? "Present" : "Missing"); // ← Debug

  if (!token) {
    console.log("No auth token found");
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',        // Important for auth
        credentials: 'include',   
      }
    );

    console.log("Auth/me status:", res.status); // ← Debug

    if (!res.ok) {
      console.log("Auth/me failed:", await res.text());
      return null;
    }

    const data = await res.json();
    console.log("Current User from Backend:", data); // ← Debug

    return data?.data ?? data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}