import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";
import LoginPage from "@/features/auth/pages/login/page";

export default function LoginRoutePage() {
  return (
    <AuthRouteFrame>
      <LoginPage />
    </AuthRouteFrame>
  );
}
