import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100, "Tên không quá 100 ký tự"),
});

export type ProfileForm = z.infer<typeof profileSchema>;

export const workspaceSchema = z.object({
  workspaceName: z.string().min(2, "Tên workspace phải có ít nhất 2 ký tự").max(100, "Tên không quá 100 ký tự"),
});

export type WorkspaceForm = z.infer<typeof workspaceSchema>;
