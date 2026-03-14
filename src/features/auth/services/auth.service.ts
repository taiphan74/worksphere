import { apiClient } from "@/lib/http/api-client";
import { removeAccessToken, setAccessToken } from "@/lib/http/auth-token";
import {
  createAuthFailureError,
} from "@/features/auth/utils/auth-error";
import type { LoginSchema } from "@/features/auth/schemas/login.schema";
import type { RegisterRequestSchema } from "@/features/auth/schemas/register.schema";
import type {
  AuthUser,
  LoginResponse,
  RegisterResponse,
} from "@/features/auth/types/auth.types";

function assertSuccessfulAuth<T extends { success: boolean; message?: string; error?: { code: string; message: string } }>(
  response: T,
) {
  if (response.success) {
    return response;
  }

  throw createAuthFailureError({
    code: response.error?.code,
    message:
      response.error?.message ||
      response.message ||
      "Đã có lỗi xảy ra. Vui lòng thử lại.",
  });
}

export const authService = {
  async login(payload: LoginSchema) {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
    const response = assertSuccessfulAuth(data);

    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }

    return response;
  },

  async register(payload: RegisterRequestSchema) {
    const { data } = await apiClient.post<RegisterResponse>(
      "/auth/register",
      payload,
    );

    return assertSuccessfulAuth(data);
  },

  async getMe() {
    const { data } = await apiClient.get<AuthUser>("/auth/me");

    return data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      removeAccessToken();
    }
  },
};
