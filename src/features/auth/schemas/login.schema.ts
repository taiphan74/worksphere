import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không đúng định dạng" })
    .max(255, { message: "Email không được vượt quá 255 ký tự" }),

  password: z
    .string()
    .min(1, { message: "Mật khẩu là bắt buộc" }),
});

export type LoginForm = z.infer<typeof loginSchema>;
