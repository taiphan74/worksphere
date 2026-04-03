import Link from "next/link";
import type { ReactNode } from "react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

type AuthShellProps = {
  children: ReactNode;
  title: string | null;
  subtitle: string | null;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden",
        "bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)]",
      )}
    >
      <FogOverlay />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center px-4 py-10 sm:px-6">
        <section
          className={cn(
            "w-full rounded-[28px] border border-white/30 bg-white/10 px-5 py-8 shadow-[0_20px_48px_rgba(86,110,148,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl before:from-white/70 before:via-white/30 before:to-transparent after:opacity-40 sm:px-8 sm:py-10",
            glassEffect,
          )}
        >
          <div className="relative z-10 flex flex-col items-center gap-8">
            <Link href="/" aria-label="Về trang chủ">
              <BrandBadge />
            </Link>
            <div className="w-full space-y-6">
              {(title || subtitle) && (
                <header className="space-y-2 text-center">
                  {title ? (
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                      {title}
                    </h1>
                  ) : null}
                  {subtitle ? (
                    <p className="text-sm text-neutral-700/80">{subtitle}</p>
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
