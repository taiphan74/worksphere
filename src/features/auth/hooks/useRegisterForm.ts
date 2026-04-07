import { useState, useTransition } from "react";
import type { ZodFormattedError } from "zod";

import {
  registerSchema,
  type RegisterForm as RegisterSchema,
} from "@/features/auth/schemas/register.schema";
import { authService } from "@/features/auth/services/auth.service";
import type { RegisterResponse } from "@/features/auth/types/auth.types";
import { logAuthError, mapAuthError } from "@/features/auth/utils/auth-error";

const initialForm: RegisterSchema = {
  email: "",
  password: "",
};

type RegisterFormErrors = Partial<Record<keyof RegisterSchema, string>>;

function getFieldErrors(error: ZodFormattedError<RegisterSchema>) {
  return {
    email: error.email?._errors[0],
    password: error.password?._errors[0],
  } satisfies RegisterFormErrors;
}

export function useRegisterForm() {
  const [form, setForm] = useState<RegisterSchema>(initialForm);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [response, setResponse] = useState<RegisterResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof RegisterSchema>(
    field: K,
    value: RegisterSchema[K],
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
    setErrorCode(null);
  }

  function validate(payload: RegisterSchema) {
    const result = registerSchema.safeParse(payload);
    if (result.success) {
      return null;
    }
    return getFieldErrors(result.error.format());
  }

  function register() {
    const nextErrors = validate(form);

    if (nextErrors) {
      setErrors(nextErrors);
      setGlobalError(null);
      setErrorCode(null);
      return Promise.resolve<RegisterResponse | null>(null);
    }

    setErrors({});
    setGlobalError(null);
    setErrorCode(null);

    return new Promise<RegisterResponse | null>((resolve) => {
      startTransition(async () => {
        try {
          const result = await authService.register(form);
          setResponse(result);
          resolve(result);
        } catch (error) {
          logAuthError("register", error);

          const mappedError = mapAuthError(error, "register");

          setErrors(mappedError.fieldErrors);
          setGlobalError(mappedError.globalError);
          setErrorCode(mappedError.error.code || null);
          resolve(null);
        }
      });
    });
  }

  return {
    form,
    errors,
    globalError,
    errorCode,
    response,
    isPending,
    updateField,
    register,
  };
}
