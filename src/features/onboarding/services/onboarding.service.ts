import { apiClientWithAuth } from "@/lib/http/api-client";
import { BaseResponse } from "@/lib/http/types";

export interface UpdateProfileRequest {
  full_name?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_key?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const onboardingService = {
  async getProfile(): Promise<Profile> {
    const response = await apiClientWithAuth.get<BaseResponse<Profile>>("/profile");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<Profile> {
    const response = await apiClientWithAuth.patch<BaseResponse<Profile>>("/profile", data);
    return response.data.data;
  },
};
