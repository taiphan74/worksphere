export type AuthErrorPayload = {
  code: string;
  message: string;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export type RegisterResponse = {
  verificationEmailSent: boolean;
  user: AuthUser;
};

export type VerifyEmailResponse = {
  verified: boolean;
};

export type ResendVerificationResponse = {
  success?: boolean;
  message?: string;
};

export type ApiEnvelope<T> = {
  status?: string;
  data: T;
  message?: string;
  success?: boolean;
  error?: AuthErrorPayload;
  retry_after_seconds?: number;
};

export type GoogleLoginRequest = {
  email: string;
  full_name: string;
  avatar_url: string;
  id_token: string;
};
