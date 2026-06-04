import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { useAuthStore } from "@/lib/store/auth.store";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
console.log(process.env.NEXT_PUBLIC_API_URL);
// ─── Axios instance ───────────────────────────────────────────────────────────

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

export const api: AxiosInstance = axios.create({
 baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attaches the in-memory access token to every request.

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// On 401: silently refresh the access token, then retry the original request.
// All queued requests during an in-flight refresh are held and replayed once
// the new token arrives.

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) return Promise.reject(error);

    const isAuthRequest = original?.url?.includes('/auth/');
    const is401 = error.response?.status === 401;

    // Skip refresh logic for:
    // - All auth endpoints (login, register, refresh, etc.)
    // - Already retried requests
    if (!is401 || original?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (original.headers) original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = data.data?.accessToken;
      const user = data.data?.user;

      if (!newToken) throw new Error("No token from refresh");

      useAuthStore.getState().setAuth(user, newToken);

      processQueue(null, newToken);

      if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
export default api;