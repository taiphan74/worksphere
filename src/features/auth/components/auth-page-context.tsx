"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AuthPageContextValue = {
  title: string | null;
  subtitle: string | null;
  setTitle: (title: string | null) => void;
  setSubtitle: (subtitle: string | null) => void;
};

const AuthPageContext = createContext<AuthPageContextValue | null>(null);

export function useAuthPage() {
  const ctx = useContext(AuthPageContext);
  if (!ctx) {
    throw new Error("useAuthPage must be used within AuthPageProvider");
  }
  return ctx;
}

type AuthPageProviderProps = {
  children: ReactNode;
  defaultTitle?: string;
  defaultSubtitle?: string;
};

export function AuthPageProvider({
  children,
  defaultTitle,
  defaultSubtitle,
}: AuthPageProviderProps) {
  const [title, setTitle] = useState<string | null>(defaultTitle ?? null);
  const [subtitle, setSubtitle] = useState<string | null>(defaultSubtitle ?? null);

  return (
    <AuthPageContext.Provider value={{ title, subtitle, setTitle, setSubtitle }}>
      {children}
    </AuthPageContext.Provider>
  );
}
