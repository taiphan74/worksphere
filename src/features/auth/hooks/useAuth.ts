"use client";

import { useState, useTransition } from "react";
import type { ZodFormattedError } from "zod";

import { loginSchema, type LoginSchema } from "@/features/auth/schemas/login.schema";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/types/auth.types";

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
      return Promise.resolve<LoginResponse | null>(null);
    }

    setErrors({});

    return new Promise<LoginResponse>((resolve) => {
      startTransition(async () => {
        const result = await authService.login(form);
        setResponse(result);
        resolve(result);
      });
    });
  }

  return {
    form,
    errors,
    response,
    isPending,
    updateField,
    login,
  };
}
