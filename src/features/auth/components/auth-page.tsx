"use client";

import { useEffect, type ReactNode } from "react";

import { useAuthPage } from "@/features/auth/components/auth-page-context";

type AuthPageProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AuthPage({ children, title, subtitle }: AuthPageProps) {
  const { setTitle, setSubtitle } = useAuthPage();

  useEffect(() => {
    setTitle(title);
    setSubtitle(subtitle ?? null);

    return () => {
      setTitle(null);
      setSubtitle(null);
    };
  }, [title, subtitle, setTitle, setSubtitle]);

  return <>{children}</>;
}
