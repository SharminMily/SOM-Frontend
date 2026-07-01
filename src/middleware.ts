import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("auth-token")?.value;

  let isValid = false;
  if (accessToken) {
    try {
      await jwtVerify(accessToken, ACCESS_SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (isValid) {
    return NextResponse.next();
  }

  // access token নাই/expired — refresh token দিয়ে নতুন access token নেওয়ার চেষ্টা
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const refreshRes = await fetch(`${process.env.BACKEND_INTERNAL_URL}/auth/refresh`, {
    method: "POST",
    headers: { Cookie: `refreshToken=${refreshToken}` },
    cache: "no-store",
  });

  if (!refreshRes.ok) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("auth-token");
    res.cookies.delete("refreshToken");
    return res;
  }

  const data = await refreshRes.json();
  const setCookieHeader = refreshRes.headers.get("set-cookie");

  const res = NextResponse.next();

  // backend থেকে আসা নতুন cookie গুলো forward করো
  if (setCookieHeader) {
    res.headers.set("set-cookie", setCookieHeader);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};