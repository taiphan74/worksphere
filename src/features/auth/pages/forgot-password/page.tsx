import Link from "next/link";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordFeaturePage() {
  return (
    <AuthShell
      title="Quên mật khẩu"
      subtitle="Nhập số điện thoại để tiếp tục quy trình đặt lại mật khẩu."
    >
      <form className="space-y-4">
        <Input
          placeholder="Số điện thoại"
          className="h-12 rounded-xl bg-background"
        />
        <Button type="button" className="h-12 w-full rounded-xl">
          Gửi yêu cầu
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
