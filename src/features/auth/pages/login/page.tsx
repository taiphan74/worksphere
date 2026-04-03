import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthPage } from "@/features/auth/components/auth-page";

export default function LoginFeaturePage() {
  return (
    <AuthPage title="Đăng nhập">
      <LoginForm />
    </AuthPage>
  );
}
