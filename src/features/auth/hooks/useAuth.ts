"use client";

import { useState, useTransition } from "react";
import type { ZodFormattedError } from "zod";

import { loginSchema, type LoginSchema } from "@/features/auth/schemas/login.schema";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/types/auth.types";
import { logAuthError, mapAuthError } from "@/features/auth/utils/auth-error";

const initialForm: LoginSchema = {
  email: "",
  password: "",
};

type LoginFormErrors = Partial<Record<keyof LoginSchema, string>>;

function getFieldErrors(error: ZodFormattedError<LoginSchema>) {
  return {
    email: error.email?._errors[0],
    password: error.password?._errors[0],
  } satisfies LoginFormErrors;
}

export function useAuth() {
  const [form, setForm] = useState<LoginSchema>(initialForm);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [response, setResponse] = useState<LoginResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof LoginSchema>(
    field: K,
    value: LoginSchema[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setGlobalError(null);
  }

  function validate(payload: LoginSchema) {
    const result = loginSchema.safeParse(payload);

    if (result.success) {
      return null;
    }

    return getFieldErrors(result.error.format());
  }

  function login() {
    const nextErrors = validate(form);

    if (nextErrors) {
      setErrors(nextErrors);
      setGlobalError(null);
      return Promise.resolve<LoginResponse | null>(null);
    }

    setErrors({});
    setGlobalError(null);

    return new Promise<LoginResponse | null>((resolve) => {
      startTransition(async () => {
        try {
          const result = await authService.login(form);
          setResponse(result);
          resolve(result);
        } catch (error) {
          logAuthError("login", error);

          const mappedError = mapAuthError(error, "login");

          setErrors(mappedError.fieldErrors);
          setGlobalError(mappedError.globalError);
          resolve(null);
        }
      });
    });
  }

  return {
    form,
    errors,
    globalError,
    response,
    isPending,
    updateField,
    login,
  };
}
