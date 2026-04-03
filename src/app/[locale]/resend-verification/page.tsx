import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import ResendVerificationPage from "@/features/auth/pages/resend-verification/page";

export default function ResendVerificationRoutePage() {
  return (
    <AuthRouteFrame>
      <ResendVerificationPage />
    </AuthRouteFrame>
  );
}
