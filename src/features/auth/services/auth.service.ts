import { apiClient } from "@/lib/http/api-client";
import { removeAccessToken, setAccessToken } from "@/lib/http/auth-token";
import type { LoginSchema } from "@/features/auth/schemas/login.schema";
import type { RegisterRequestSchema } from "@/features/auth/schemas/register.schema";
import type {
  AuthUser,
  LoginResponse,
  RegisterResponse,
} from "@/features/auth/types/auth.types";

export const authService = {
  async login(payload: LoginSchema) {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);

    setAccessToken(data.accessToken);

    return data;
  },

  async register(payload: RegisterRequestSchema) {
    const { data } = await apiClient.post<RegisterResponse>(
      "/auth/register",
      payload,
    );

    return data;
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
