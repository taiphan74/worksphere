"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const { form, updateField, isPending, login } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await login(form);

    if (response.success) {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Số điện thoại
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Số điện thoại"
            className="h-12 rounded-xl bg-background"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Mật khẩu
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Mật khẩu"
            className="bg-background"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link
          href="/forgot-password"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Quên mật khẩu?
        </Link>
        <Link
          href="/register"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Đăng ký
        </Link>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-sm"
        disabled={isPending}
      >
        Đăng nhập
      </Button>

      <SocialLogin />
    </form>
  );
}
