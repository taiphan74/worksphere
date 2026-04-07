"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  registerSchema,
  type RegisterForm,
} from "@/features/auth/schemas/register.schema";
import { authService } from "@/features/auth/services/auth.service";
import type { RegisterResponse } from "@/features/auth/types/auth.types";
import { logAuthError, mapAuthError } from "@/features/auth/utils/auth-error";

/**
 * Hook quản lý toàn bộ logic đăng ký:
 * - React Hook Form + Zod validation
 * - TanStack Query useMutation gọi API
 * - Map lỗi từ backend vào form field errors + root error
 *
 * Trả về object gọn để RegisterForm chỉ lo phần UI.
 */
export function useRegisterMutation() {
  // ─── React Hook Form setup ───────────────────────────────────────
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // validate khi submit; có thể đổi "onChange" nếu muốn real-time
    reValidateMode: "onChange",
  });

  // ─── TanStack Query mutation ─────────────────────────────────────
  const mutation = useMutation<RegisterResponse, unknown, RegisterForm>({
    mutationFn: (payload) => authService.register(payload),
    onError: (error) => {
      // Log để debug
      logAuthError("register", error);

      // Map lỗi backend → field errors + global error
      const mapped = mapAuthError(error, "register");

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
          type: "server",
          message: mapped.globalError,
        });
      }
    },
  });

  // ─── Wrapper submit tương thích với RHF ─────────────────────────
  /**
   * Gọi từ form onSubmit. RHF sẽ validate trước khi truyền payload vào.
   */
  async function handleSubmit(values: RegisterForm) {
    // Xoá lỗi cũ trước khi gửi request mới
    form.clearErrors();
    return mutation.mutateAsync(values);
  }

  // ─── Public API ──────────────────────────────────────────────────
  return {
    /** Instance của useForm — dùng form.register(), form.control, form.formState, ... */
    form,

    /** Mutation object từ useMutation — isPending, isSuccess, data, ... */
    mutation,

    /** Hàm submit đã wrapper — truyền vào form.handleSubmit(handleSubmit) */
    handleSubmit,

    /** Tiện ích: xoá mọi lỗi + reset form */
    resetAll() {
      form.reset();
      form.clearErrors();
    },
  };
}
