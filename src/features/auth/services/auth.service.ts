import { apiClient } from "@/lib/http/api-client";
import { removeAccessToken, setAccessToken } from "@/lib/http/auth-token";
import { createAuthFailureError } from "@/features/auth/utils/auth-error";
import type { LoginSchema } from "@/features/auth/schemas/login.schema";
import type { RegisterRequestSchema } from "@/features/auth/schemas/register.schema";
import type {
  ApiEnvelope,
  AuthUser,
  LoginResponse,
  RegisterResponse,
  ResendVerificationResponse,
  VerifyEmailResponse,
} from "@/features/auth/types/auth.types";

type AuthPayload = {
  success?: boolean;
  message?: string;
  error?: { code?: string; message?: string };
};

type ApiUser = {
  id: string;
  email: string;
  isVerified?: boolean;
  is_verified?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type ApiLoginData = {
  success?: boolean;
  message?: string;
  error?: { code?: string; message?: string };
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: ApiUser;
};

type ApiRegisterData = ApiLoginData & {
  verificationEmailSent?: boolean;
  verification_email_sent?: boolean;
};

function isApiEnvelope<T>(payload: T | ApiEnvelope<T>): payload is ApiEnvelope<T> {
  return Boolean(payload && typeof payload === "object" && "data" in payload);
}

function normalizeUser(user?: ApiUser): AuthUser | undefined {
  if (!user) {
    return undefined;
  }

  return {
    id: user.id,
    email: user.email,
    isVerified: user.isVerified ?? user.is_verified,
    createdAt: user.createdAt ?? user.created_at,
    updatedAt: user.updatedAt ?? user.updated_at,
  };
}

function normalizeLoginResponse(payload: ApiLoginData): LoginResponse {
  return {
    success: payload.success ?? true,
    message: payload.message,
    error: payload.error
      ? {
          code: payload.error.code || "",
          message: payload.error.message || payload.message || "",
        }
      : undefined,
    accessToken: payload.accessToken ?? payload.access_token,
    refreshToken: payload.refreshToken ?? payload.refresh_token,
    user: normalizeUser(payload.user),
  };
}

function normalizeRegisterResponse(payload: ApiRegisterData): RegisterResponse {
  return {
    ...normalizeLoginResponse(payload),
    verificationEmailSent:
      payload.verificationEmailSent ?? payload.verification_email_sent,
  };
}

function extractPayload<T>(payload: T | ApiEnvelope<T>) {
  if (isApiEnvelope(payload)) {
    return {
      data: payload.data,
      message: payload.message,
      success: payload.success,
      error: payload.error,
    };
  }

  return {
    data: payload,
    message: undefined,
    success: undefined,
    error: undefined,
  };
}

function assertSuccessfulAuth<T extends AuthPayload>(response: T) {
  if (response.success ?? true) {
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
    const { data } = await apiClient.post<LoginResponse | ApiEnvelope<ApiLoginData>>(
      "/auth/login",
      payload,
    );
    const normalized = normalizeLoginResponse(extractPayload(data).data as ApiLoginData);
    const response = assertSuccessfulAuth(normalized);

    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }

    return response;
  },

  async register(payload: RegisterRequestSchema) {
    const { data } = await apiClient.post<
      RegisterResponse | ApiEnvelope<ApiRegisterData>
    >("/auth/register", payload);
    const normalized = normalizeRegisterResponse(
      extractPayload(data).data as ApiRegisterData,
    );
    const response = assertSuccessfulAuth(normalized);

    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }

    return response;
  },

  async verifyEmail(token: string) {
    const { data } = await apiClient.get<
      VerifyEmailResponse | ApiEnvelope<VerifyEmailResponse>
    >("/auth/verify-email", {
      params: { token },
    });
    const extracted = extractPayload(data);

    return extracted.data as VerifyEmailResponse;
  },

  async resendVerification(email: string) {
    const { data } = await apiClient.post<
      ResendVerificationResponse | ApiEnvelope<null>
    >("/auth/resend-verification", {
      email,
    });
    const extracted = extractPayload(data);

    return {
      success: extracted.success ?? true,
      message:
        extracted.message ||
        "Nếu email tồn tại, chúng tôi đã gửi email xác thực.",
    };
  },

  async getMe() {
    const { data } = await apiClient.get<AuthUser | ApiEnvelope<ApiUser>>(
      "/auth/me",
    );
    const extracted = extractPayload(data);

    return normalizeUser(extracted.data as ApiUser) as AuthUser;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      removeAccessToken();
    }
  },
};
