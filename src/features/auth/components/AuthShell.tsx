import Link from "next/link";
import type { ReactNode } from "react";

import { BrandBadge } from "@/components/brand/brand-badge";

type AuthShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-[28px] border border-input bg-card px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="flex flex-col items-center gap-8">
            <Link href="/" aria-label="Về trang chủ">
              <BrandBadge />
            </Link>
            <div className="w-full space-y-6">
              {(title || subtitle) && (
                <header className="space-y-2 text-center">
                  {title ? (
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                      {title}
                    </h1>
                  ) : null}
                  {subtitle ? (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  ) : null}
                </header>
              )}
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
