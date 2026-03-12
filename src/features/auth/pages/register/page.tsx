import Link from "next/link";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { ResendVerificationButton } from "@/features/auth/components/ResendVerificationButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterFeaturePage() {
  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Cấu trúc trang đã được đưa vào feature auth để dễ mở rộng tiếp."
    >
      <form className="space-y-4">
        <Input
          placeholder="Họ và tên"
          className="h-12 rounded-xl bg-background"
        />
        <Input
          placeholder="Số điện thoại"
          className="h-12 rounded-xl bg-background"
        />
        <Input
          placeholder="Mật khẩu"
          className="h-12 rounded-xl bg-background"
        />
        <Button type="button" className="h-12 w-full rounded-xl">
          Đăng ký
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between gap-4 text-sm">
        <Link
          href="/login"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Đã có tài khoản?
        </Link>
        <ResendVerificationButton />
      </div>
    </AuthShell>
  );
}
