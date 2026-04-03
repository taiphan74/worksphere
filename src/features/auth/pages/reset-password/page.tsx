import Link from "next/link";

import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { AuthPage } from "@/features/auth/components/auth-page";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export default function ResetPasswordFeaturePage() {
  return (
    <AuthPage
      title="Đặt lại mật khẩu"
      subtitle="Khung trang đã sẵn sàng để nối token reset và API sau."
    >
      <form className="space-y-4">
        <PasswordInput
          placeholder="Mật khẩu mới"
          className={cn(
            "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
            glassEffect,
          )}
        />
        <PasswordInput
          placeholder="Nhập lại mật khẩu"
          className={cn(
            "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
            glassEffect,
          )}
        />
        <Button
          type="button"
          variant="glass"
          className="h-12 w-full rounded-xl"
        >
          Cập nhật mật khẩu
        </Button>
      </form>

      <div className="mt-4 text-sm">
        <Link
          href="/login"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </AuthPage>
  );
}
