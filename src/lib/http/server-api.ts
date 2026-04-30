import axios from "axios";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ─── Server-side Refresh Token ──────────────────────────────────────────

let isRefreshing = false;
type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};
let failedQueue: QueueItem[] = [];

/**
 * Xử lý queue khi refresh thành công — retry tất cả request đã chờ
 */
function processQueue() {
  failedQueue.forEach((item) => item.resolve());
  failedQueue = [];
}

/**
 * Xử lý queue khi refresh thất bại — reject tất cả request đã chờ
 */
function rejectQueue(error: unknown) {
  failedQueue.forEach((item) => item.reject(error));
  failedQueue = [];
}

/**
 * Parse Set-Cookie header và apply vào response cookie của browser
 */
async function applySetCookies(setCookieHeaders: string | string[]) {
  const cookieStore = await cookies();
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];

  for (const cookieStr of headers) {
    const [nameValue] = cookieStr.split(";");
    const eqIndex = nameValue.indexOf("=");
    if (eqIndex === -1) continue;

    const name = nameValue.slice(0, eqIndex).trim();
    const value = nameValue.slice(eqIndex + 1).trim();

    if (!name) continue;

    cookieStore.set(name, value, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
}

/**
 * Gọi API refresh token — backend sẽ trả Set-Cookie với access_token mới
 */
async function refreshServerToken(cookieHeader: string): Promise<void> {
  const refreshResponse = await axios.post(
    `${baseURL}/auth/refresh`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    },
  );

  const setCookieHeaders = refreshResponse.headers["set-cookie"];
  if (setCookieHeaders) {
    await applySetCookies(setCookieHeaders);
  }
}

// ─── Server API Client Factory ──────────────────────────────────────────

/**
 * Tạo axios instance cho server-side request, tự động gửi cookie và xử lý 401 refresh.
 */
export async function createServerApiClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const api = axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  // ─── 401 Interceptor ──────────────────────────────────────────────────

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Không phải 401 hoặc không thể retry → reject
      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      // Refresh request tự nó fail → không retry nữa
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Đã retry rồi → không retry nữa
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // Nếu đang có refresh request khác đang chạy → đẩy vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      // Bắt đầu refresh
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        await refreshServerToken(cookieHeader);
        processQueue();
        isRefreshing = false;

        // Lấy cookie mới nhất sau khi refresh
        const updatedCookieStore = await cookies();
        const updatedCookieHeader = updatedCookieStore.toString();
        originalRequest.headers = {
          ...originalRequest.headers,
          ...(updatedCookieHeader ? { Cookie: updatedCookieHeader } : {}),
        };

        return api(originalRequest);
      } catch (refreshError) {
        rejectQueue(refreshError);
        isRefreshing = false;

        return Promise.reject(error);
      }
    },
  );

  return api;
}