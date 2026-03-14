import axios, { AxiosHeaders } from "axios";

import { getAccessToken } from "@/lib/http/auth-token";
import { normalizeHttpError } from "@/lib/http/errors";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  const headers = AxiosHeaders.from(config.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalizedError = normalizeHttpError(error);

    if (normalizedError.status === 401) {
      // TODO: add refresh token flow or forced logout strategy here.
    }

    return Promise.reject(normalizedError);
  },
);
