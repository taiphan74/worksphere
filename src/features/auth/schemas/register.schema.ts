import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không đúng định dạng" })
    .max(255, { message: "Email không được vượt quá 255 ký tự" }),

  password: z
    .string()
    .min(1, { message: "Mật khẩu là bắt buộc" })
    .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
});

// Schema dùng để gửi request lên API
export const registerRequestSchema = registerSchema;

export type RegisterForm = z.infer<typeof registerSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
