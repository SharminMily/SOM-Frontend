import { cookies } from "next/headers";
import { cache } from "react";
import { jwtVerify } from "jose";

const secret = process.env.ACCESS_TOKEN_SECRET;
if (!secret) {
  throw new Error("ACCESS_TOKEN_SECRET is missing");
}
const ACCESS_SECRET = new TextEncoder().encode(secret);

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth-token")?.value;

  if (!accessToken) return null;

  try {
    const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);

    console.log("JWT verified:", payload);

    return {
      id: payload.id as string,
      email: payload.email as string,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
      role: payload.role as string,
      status: payload.status as string,
      avatarUrl: payload.avatarUrl as string,
    };
  } catch (err) {
    console.error("JWT Verify Error:", err);
    return null;
  }
});