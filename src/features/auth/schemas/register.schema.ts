import { z } from "zod";

const registerFieldsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email lÃ  báº¯t buá»™c")
    .email("Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng"),
  password: z
    .string()
    .min(1, "Máº­t kháº©u lÃ  báº¯t buá»™c")
    .min(8, "Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±"),
  confirmPassword: z
    .string()
    .min(1, "XÃ¡c nháº­n máº­t kháº©u lÃ  báº¯t buá»™c"),
});

export const registerSchema = registerFieldsSchema.refine(
  (value) => value.password === value.confirmPassword,
  {
    message: "Máº­t kháº©u xÃ¡c nháº­n khÃ´ng khá»›p",
    path: ["confirmPassword"],
  },
);

export const registerRequestSchema = registerFieldsSchema.omit({
  confirmPassword: true,
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterRequestSchema = z.infer<typeof registerRequestSchema>;
