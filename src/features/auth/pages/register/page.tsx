import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterFeaturePage() {
  return (
    <AuthShell title="Tạo tài khoản">
      <RegisterForm />
    </AuthShell>
  );
}
