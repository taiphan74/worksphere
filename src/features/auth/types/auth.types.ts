export type AuthUser = {
  id: string;
  email: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthErrorPayload = {
  code: string;
  message: string;
};

type AuthResponseBase = {
  success: boolean;
  message?: string;
  error?: AuthErrorPayload;
};

export type LoginResponse = AuthResponseBase & {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  isNewUser?: boolean;
};

export type RegisterResponse = AuthResponseBase & {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  verificationEmailSent?: boolean;
};

export type VerifyEmailResponse = {
  verified: boolean;
};

export type ResendVerificationResponse = {
  success?: boolean;
  message?: string;
};

export type ApiEnvelope<T> = {
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
