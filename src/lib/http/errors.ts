import { AxiosError, isAxiosError } from "axios";

type ErrorResponseData = {
  message?: string;
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

  return "message" in value;
}

function createAppHttpError(
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

    return createAppHttpError(
      responseData?.message || error.message || DEFAULT_ERROR_MESSAGE,
      {
        status: error.response?.status,
        code: error.code,
        details: responseData,
      },
    );
  }

  if (error instanceof Error) {
    return createAppHttpError(error.message || DEFAULT_ERROR_MESSAGE);
  }

  return createAppHttpError(DEFAULT_ERROR_MESSAGE);
}

export function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const responseData = isErrorResponseData(error.response?.data)
      ? error.response?.data
      : undefined;

    return responseData?.message || error.message || DEFAULT_ERROR_MESSAGE;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function isAxiosHttpError(error: unknown): error is AxiosError<ErrorResponseData> {
  return isAxiosError<ErrorResponseData>(error);
}
