import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { useAuthStore } from "lib/store/auth.store";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,        // always send the httpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
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
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only intercept 401 errors that haven't already been retried,
    // and skip the refresh endpoint itself to prevent infinite loops.
    const isRefreshEndpoint = original?.url?.includes("/auth/refresh");
    if (error.response?.status !== 401 || original?._retry || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    // Mark this request so we don't retry it again.
    original._retry = true;

    // If a refresh is already in-flight, queue this request.
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
      // Call refresh directly (not through `api`) to avoid the interceptor loop.
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken: string = data.data.accessToken;
      const user = data.data.user;

      // Persist the new token and user in the store.
      useAuthStore.getState().setAuth(user, newToken);

      // Replay all queued requests with the fresh token.
      processQueue(null, newToken);

      if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      // Refresh failed — session is truly expired.
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();

      // Redirect to login only in the browser.
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;