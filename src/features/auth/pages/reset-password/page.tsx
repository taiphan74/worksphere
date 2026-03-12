import Link from "next/link";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";

export default function ResetPasswordFeaturePage() {
  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      subtitle="Khung trang đã sẵn sàng để nối token reset và API sau."
    >
      <form className="space-y-4">
        <PasswordInput
          placeholder="Mật khẩu mới"
          className="bg-background"
        />
        <PasswordInput
          placeholder="Nhập lại mật khẩu"
          className="bg-background"
        />
        <Button type="button" className="h-12 w-full rounded-xl">
          Cập nhật mật khẩu
        </Button>
      </form>

      <div className="mt-4 text-sm">
        <Link
          href="/login"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </AuthShell>
  );
}
