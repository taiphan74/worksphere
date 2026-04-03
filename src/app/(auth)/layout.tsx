"use client";

import { type ReactNode } from "react";

import { AuthShell } from "@/features/auth/components/AuthShell";
import {
  AuthPageProvider,
  useAuthPage,
} from "@/features/auth/components/auth-page-context";

function AuthShellWithState({ children }: { children: ReactNode }) {
  const { title, subtitle } = useAuthPage();
  return <AuthShell title={title} subtitle={subtitle}>{children}</AuthShell>;
}

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return (
    <AuthPageProvider>
      <AuthShellWithState>{children}</AuthShellWithState>
    </AuthPageProvider>
  );
}
