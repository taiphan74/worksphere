"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  loginSchema,
  type LoginForm,
} from "@/features/auth/schemas/login.schema";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/types/auth.types";
import { logAuthError, mapAuthError } from "@/features/auth/utils/auth-error";

/**
 * Hook quản lý toàn bộ logic đăng nhập:
 * - React Hook Form + Zod validation
 * - TanStack Query useMutation gọi API
 * - Map lỗi từ backend vào form field errors + root error
 */
export function useLoginMutation() {
  // ─── React Hook Form setup ───────────────────────────────────────
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // ─── TanStack Query mutation ─────────────────────────────────────
  const mutation = useMutation<LoginResponse, unknown, LoginForm>({
    mutationFn: (payload) => authService.login(payload),
    onError: (error) => {
      // Log để debug
      logAuthError("login", error);

      // Map lỗi backend → field errors + global error
      const mapped = mapAuthError(error, "login");

      // Đặt lỗi lên từng field (email, password)
      Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
        if (message) {
          form.setError(field as "email" | "password", {
            type: "server",
            message,
          });
        }
      });

      // Đặt lỗi global lên root
      if (mapped.globalError) {
        form.setError("root", {
          // Lưu lại error code để UI có thể xử lý (ví dụ: EMAIL_NOT_VERIFIED)
          type: mapped.error.code || "server",
          message: mapped.globalError,
        });
      }
    },
  });

  // ─── Wrapper submit tương thích với RHF ─────────────────────────
  async function handleSubmit(values: LoginForm) {
    // Xoá lỗi cũ trước khi gửi request mới
    form.clearErrors();
    return mutation.mutateAsync(values);
  }

  // ─── Public API ──────────────────────────────────────────────────
  return {
    form,
    mutation,
    handleSubmit,
    resetAll() {
      form.reset();
      form.clearErrors();
    },
  };
}
