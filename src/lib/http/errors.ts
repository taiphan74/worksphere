import { AxiosError, isAxiosError } from "axios";

export type ErrorResponseData = {
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

export type AppHttpError = Error & {
  status?: number;
  code?: string;
  details?: ErrorResponseData;
};

const DEFAULT_ERROR_MESSAGE = "Đã có lỗi xảy ra. Vui lòng thử lại.";

function isErrorResponseData(value: unknown): value is ErrorResponseData {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "message" in value || "error" in value;
}

export function createAppHttpError(
  message: string,
  options?: {
    status?: number;
    code?: string;
    details?: ErrorResponseData;
  },
) {
  const error = new Error(message) as AppHttpError;

  error.name = "AppHttpError";
  error.status = options?.status;
  error.code = options?.code;
  error.details = options?.details;

  return error;
}

export function normalizeHttpError(error: unknown) {
  if (isAxiosError(error)) {
    const responseData = isErrorResponseData(error.response?.data)
      ? error.response?.data
      : undefined;
    const responseCode = responseData?.error?.code;
    const responseMessage = responseData?.error?.message || responseData?.message;

    return createAppHttpError(
      responseMessage || error.message || DEFAULT_ERROR_MESSAGE,
      {
        status: error.response?.status,
        code: responseCode || error.code,
        details: responseData,
      },
    );
  }

  if (error instanceof Error) {
    const appError = error as AppHttpError;

    return createAppHttpError(error.message || DEFAULT_ERROR_MESSAGE, {
      status: appError.status,
      code: appError.code,
      details: appError.details,
    });
  }

  return createAppHttpError(DEFAULT_ERROR_MESSAGE);
}

export function getErrorMessage(error: unknown) {
  return normalizeHttpError(error).message;
}

export function isAxiosHttpError(error: unknown): error is AxiosError<ErrorResponseData> {
  return isAxiosError<ErrorResponseData>(error);
}
