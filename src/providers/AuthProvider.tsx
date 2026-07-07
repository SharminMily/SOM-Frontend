"use client";

import { useEffect, useRef } from "react";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/lib/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const ranOnce = useRef(false);

  useEffect(() => {
    // React StrictMode-এ dev mode-এ ডাবল-রান আটকায়
    if (ranOnce.current) return; 
    ranOnce.current = true;

    api
      .post("/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const accessToken = data?.accessToken;
        const user = data?.user;
        if (accessToken && user) {
          setAuth(user, accessToken);
        } else {
          clearAuth();
        }
      })
      .catch(() => {
        clearAuth();
      });
  }, []);

  return <>{children}</>;
}