import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import VerifyEmailPage from "@/features/auth/pages/verify-email/page";

export default function VerifyEmailRoutePage() {
  return (
    <AuthRouteFrame>
      <VerifyEmailPage />
    </AuthRouteFrame>
  );
}
