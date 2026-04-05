import { AuthRouteFrame } from "@/features/auth/components/AuthRouteFrame";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthRouteFrame>{children}</AuthRouteFrame>;
}
