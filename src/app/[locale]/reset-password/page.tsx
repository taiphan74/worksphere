import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import ResetPasswordPage from "@/features/auth/pages/reset-password/page";

export default function ResetPasswordRoutePage() {
  return (
    <AuthRouteFrame>
      <ResetPasswordPage />
    </AuthRouteFrame>
  );
}
