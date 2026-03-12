import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginFeaturePage() {
  return (
    <AuthShell title="Đăng nhập">
      <LoginForm />
    </AuthShell>
  );
}
