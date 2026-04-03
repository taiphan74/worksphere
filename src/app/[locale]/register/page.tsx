import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import RegisterPage from "@/features/auth/pages/register/page";

export default function RegisterRoutePage() {
  return (
    <AuthRouteFrame>
      <RegisterPage />
    </AuthRouteFrame>
  );
}
