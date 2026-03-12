export type LoginResponseDto = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
};
