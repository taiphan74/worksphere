import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthPage } from "@/features/auth/components/auth-page";

export default function RegisterFeaturePage() {
  return (
    <AuthPage title="Tạo tài khoản">
      <RegisterForm />
    </AuthPage>
  );
}
