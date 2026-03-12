"use client";

import { useState, useTransition } from "react";

import type { LoginRequestDto } from "@/features/auth/dto/login-request";
import type { LoginResponseDto } from "@/features/auth/dto/login-response";
import { authService } from "@/features/auth/services/authService";

const initialForm: LoginRequestDto = {
  phone: "",
  password: "",
};

export function useAuth() {
  const [form, setForm] = useState<LoginRequestDto>(initialForm);
  const [response, setResponse] = useState<LoginResponseDto | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof LoginRequestDto>(
    field: K,
    value: LoginRequestDto[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function login(payload: LoginRequestDto) {
    return new Promise<LoginResponseDto>((resolve) => {
      startTransition(async () => {
        const result = await authService.login(payload);
        setResponse(result);
        resolve(result);
      });
    });
  }

  return {
    form,
    response,
    isPending,
    updateField,
    login,
  };
}
