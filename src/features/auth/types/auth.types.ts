export type AuthUser = {
  id: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
  message?: string;
};

export type RegisterResponse = {
  user: AuthUser;
  message?: string;
};
