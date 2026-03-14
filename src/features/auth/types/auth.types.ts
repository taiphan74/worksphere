export type AuthUser = {
  id: string;
  email: string;
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
};

export type RegisterResponse = AuthResponseBase & {
  user?: AuthUser;
};
