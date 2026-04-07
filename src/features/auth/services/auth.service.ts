import { apiClient, apiClientWithAuth } from "@/lib/http/api-client";
import type { LoginForm } from "@/features/auth/schemas/login.schema";
import type { RegisterRequest } from "@/features/auth/schemas/register.schema";
import type {
  ApiEnvelope,
  AuthUser,
  GoogleLoginRequest,
  LoginResponse,
  RegisterResponse,
  ResendVerificationResponse,
  VerifyEmailResponse,
} from "@/features/auth/types/auth.types";


type ApiUser = {
  id: string;
  email: string;
  full_name?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

type ApiLoginData = {
  user: ApiUser;
};

type ApiRegisterData = {
  verification_email_sent: boolean;
  user: ApiUser;
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
    fullName: user.full_name,
    isVerified: user.is_verified,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
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

export const authService = {
  async login(payload: LoginForm): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiLoginData | ApiEnvelope<ApiLoginData>>(
      "/auth/login",
      payload,
    );
    const extracted = extractPayload(data);
    const apiData = extracted.data;

    return {
      user: normalizeUser(apiData.user)!,
    };
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await apiClient.post<
      ApiRegisterData | ApiEnvelope<ApiRegisterData>
    >("/auth/register", payload);
    const extracted = extractPayload(data);
    const apiData = extracted.data;

    return {
      verificationEmailSent: apiData.verification_email_sent,
      user: normalizeUser(apiData.user)!,
    };
  },

  async googleLogin(payload: GoogleLoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiLoginData | ApiEnvelope<ApiLoginData>>(
      "/auth/google",
      payload,
    );
    const extracted = extractPayload(data);
    const apiData = extracted.data;

    return {
      user: normalizeUser(apiData.user)!,
    };
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
    const { data } = await apiClientWithAuth.get<AuthUser | ApiEnvelope<ApiUser>>(
      "/auth/me",
    );
    const extracted = extractPayload(data);

    return normalizeUser(extracted.data as ApiUser) as AuthUser;
  },

  async logout() {
    try {
      await apiClientWithAuth.post("/auth/logout");
    } finally {
      // With HttpOnly cookies, we can't directly remove them from JS
      // The backend handles invalidating the session/refresh token
    }
  },
};
