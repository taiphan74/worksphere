import type { ReactNode } from "react";

type AuthRouteLayoutProps = {
  children: ReactNode;
};

export default function AuthRouteLayout({
  children,
}: AuthRouteLayoutProps) {
  return <>{children}</>;
}
