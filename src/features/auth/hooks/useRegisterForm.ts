"use client";

import { useState, useTransition } from "react";
import type { ZodFormattedError } from "zod";

import {
  registerRequestSchema,
  type RegisterRequestSchema,
} from "@/features/auth/schemas/register.schema";
import { authService } from "@/features/auth/services/auth.service";
import type { RegisterResponse } from "@/features/auth/types/auth.types";

const initialForm: RegisterRequestSchema = {
  email: "",
  password: "",
};

type RegisterFormErrors = Partial<Record<keyof RegisterRequestSchema, string>>;

function getFieldErrors(error: ZodFormattedError<RegisterRequestSchema>) {
  return {
    email: error.email?._errors[0],
    password: error.password?._errors[0],
  } satisfies RegisterFormErrors;
}

export function useRegisterForm() {
  const [form, setForm] = useState<RegisterRequestSchema>(initialForm);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [response, setResponse] = useState<RegisterResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof RegisterRequestSchema>(
    field: K,
    value: RegisterRequestSchema[K],
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

  function validate(payload: RegisterRequestSchema) {
    const result = registerRequestSchema.safeParse(payload);

    if (result.success) {
      return null;
    }

    return getFieldErrors(result.error.format());
  }

  function register() {
    const nextErrors = validate(form);

    if (nextErrors) {
      setErrors(nextErrors);
      return Promise.resolve<RegisterResponse | null>(null);
    }

    setErrors({});

    return new Promise<RegisterResponse>((resolve) => {
      startTransition(async () => {
        const result = await authService.register(form);
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
    register,
  };
}
