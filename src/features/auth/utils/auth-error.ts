import {
  createAppHttpError,
  normalizeHttpError,
  type AppHttpError,
} from "@/lib/http/errors";

type AuthMode = "login" | "register";
type AuthField = "email" | "password";

export type AuthErrorState = {
  fieldErrors: Partial<Record<AuthField, string>>;
  globalError: string | null;
  error: AppHttpError;
};

const INVALID_CREDENTIALS_MESSAGE = "Email hoặc mật khẩu không đúng";

const EMAIL_ERROR_CODES = [
  "EMAIL_REQUIRED",
  "EMAIL_INVALID",
  "INVALID_EMAIL",
  "EMAIL_ALREADY_EXISTS",
  "EMAIL_EXISTS",
  "EMAIL_TAKEN",
];

const PASSWORD_ERROR_CODES = [
  "PASSWORD_REQUIRED",
  "PASSWORD_INVALID",
  "INVALID_PASSWORD",
  "PASSWORD_TOO_SHORT",
  "WEAK_PASSWORD",
  "PASSWORD_MISMATCH",
];

const GLOBAL_ERROR_CODES = [
  "ACCOUNT_SUSPENDED",
  "USER_SUSPENDED",
  "ACCOUNT_INACTIVE",
  "USER_INACTIVE",
  "ACCOUNT_DISABLED",
  "USER_DISABLED",
];

function includesAny(value: string, patterns: string[]) {
  return patterns.some((pattern) => value.includes(pattern));
}

function inferFieldFromMessage(message: string): AuthField | null {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email")) {
    return "email";
  }

  if (
    normalizedMessage.includes("password") ||
    normalizedMessage.includes("mật khẩu")
  ) {
    return "password";
  }

  return null;
}

export function createAuthFailureError(options: {
  message: string;
  code?: string;
}) {
  return createAppHttpError(options.message, {
    code: options.code,
    details: {
      message: options.message,
      error: {
        code: options.code,
        message: options.message,
      },
    },
  });
}

export function logAuthError(context: AuthMode, error: unknown) {
  const appError = normalizeHttpError(error);

  console.error(`[auth:${context}]`, {
    message: appError.message,
    code: appError.code,
    status: appError.status,
    details: appError.details,
  });
}

export function mapAuthError(error: unknown, mode: AuthMode): AuthErrorState {
  const appError = normalizeHttpError(error);
  const code = (appError.code || "").toUpperCase();
  const backendMessage =
    appError.details?.error?.message ||
    appError.details?.message ||
    appError.message;
  const fieldErrors: Partial<Record<AuthField, string>> = {};

  if (code === "INVALID_CREDENTIALS") {
    fieldErrors.password = INVALID_CREDENTIALS_MESSAGE;

    return {
      fieldErrors,
      globalError: null,
      error: appError,
    };
  }

  if (
    includesAny(code, ["RATE_LIMIT", "TOO_MANY_REQUESTS"]) ||
    includesAny(code, GLOBAL_ERROR_CODES)
  ) {
    return {
      fieldErrors,
      globalError: backendMessage,
      error: appError,
    };
  }

  if (
    includesAny(code, EMAIL_ERROR_CODES) ||
    (mode === "register" && includesAny(code, ["EMAIL"]))
  ) {
    fieldErrors.email = backendMessage;
  } else if (includesAny(code, PASSWORD_ERROR_CODES)) {
    fieldErrors.password = backendMessage;
  } else if (
    includesAny(code, ["VALIDATION", "BIND", "INVALID_INPUT", "BAD_REQUEST"])
  ) {
    const field = inferFieldFromMessage(backendMessage);

    if (field) {
      fieldErrors[field] = backendMessage;
    }
  }

  return {
    fieldErrors,
    globalError: Object.keys(fieldErrors).length > 0 ? null : backendMessage,
    error: appError,
  };
}
