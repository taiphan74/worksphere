import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password/page";

export default function ForgotPasswordRoutePage() {
  return (
    <AuthRouteFrame>
      <ForgotPasswordPage />
    </AuthRouteFrame>
  );
}
