import axios from "axios";

import { normalizeHttpError } from "@/lib/http/errors";

const config = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Instance cho các request công khai (không gửi cookie)
export const apiClient = axios.create(config);

// Instance cho các request cần xác thực (luôn gửi cookie)
export const apiClientWithAuth = axios.create({
  ...config,
  withCredentials: true,
});

// ─── Refresh Token Queue Mechanism ─────────────────────────────────────

// Hàng chờ chứa các hàm resolve/reject cho các request bị lỗi 401
type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueItem[] = [];
let isRefreshing = false;

/**
 * Xử lý hàng chờ khi refresh token thành công
 * Retry lại tất cả các request đã được đẩy vào queue
 */
const processQueue = () => {
  failedQueue.forEach((item) => item.resolve());
  failedQueue = [];
};

/**
 * Xử lý hàng chờ khi refresh token thất bại
 * Reject tất cả các request trong queue
 */
const rejectQueue = (error: unknown) => {
  failedQueue.forEach((item) => item.reject(error));
  failedQueue = [];
};

/**
 * Gọi API refresh token
 * Backend sẽ tự động set cookie access_token mới (HttpOnly)
 */
async function refreshAccessToken(): Promise<void> {
  // Tạo một axios instance riêng để tránh vòng lặp interceptor
  const refreshClient = axios.create({
    ...config,
    withCredentials: true,
  });

  await refreshClient.post("/auth/refresh");
}

// ─── Setup Response Interceptor ────────────────────────────────────────

const setupResponseInterceptor = (instance: typeof apiClient) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const normalizedError = normalizeHttpError(error);
      const originalRequest = (error as { config: unknown }).config;

      // Nếu không phải lỗi 401 hoặc không có originalRequest, reject luôn
      if (normalizedError.status !== 401 || !originalRequest) {
        return Promise.reject(normalizedError);
      }

      // Nếu request này là của refresh token, không retry nữa
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(normalizedError);
      }

      // Nếu đang có một request refresh khác đang chạy, đẩy vào queue và chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      // Chưa có request refresh nào đang chạy → bắt đầu refresh
      isRefreshing = true;

      try {
        await refreshAccessToken();

        // Refresh thành công → process queue (resolve tất cả)
        processQueue();
        isRefreshing = false;

        // Retry lại request gốc với cookie mới (browser tự gửi)
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (refresh token hết hạn hoặc invalid)
        rejectQueue(refreshError);
        isRefreshing = false;

        // TODO: Logout và redirect về /login nếu cần
        // Ví dụ: window.location.href = "/login";

        return Promise.reject(normalizedError);
      }
    },
  );
};

setupResponseInterceptor(apiClientWithAuth);
