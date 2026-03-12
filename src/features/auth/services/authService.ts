import type { LoginRequestDto } from "@/features/auth/dto/login-request";
import type { LoginResponseDto } from "@/features/auth/dto/login-response";
import type { RegisterRequestDto } from "@/features/auth/dto/register-request";
import type { RegisterResponseDto } from "@/features/auth/dto/register-response";

async function sleep(duration: number) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export const authService = {
  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    await sleep(300);

    return {
      success: payload.phone.length > 0 && payload.password.length > 0,
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      message: "Ready to integrate with auth API",
    };
  },

  async register(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
    await sleep(300);

    return {
      success:
        payload.fullName.length > 0 &&
        payload.phone.length > 0 &&
        payload.password.length > 0,
      message: "Ready to integrate with registration API",
    };
  },
};
