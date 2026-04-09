"use client";

import { motion } from "motion/react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { glass, glassLift } from "@/styles/glass";

const backgroundGradient =
  "bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)]";

const dotTransition = {
  duration: 1.2,
  repeat: Number.POSITIVE_INFINITY,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

const accentTransition = {
  duration: 18,
  repeat: Number.POSITIVE_INFINITY,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

interface LoadingSplashProps {
  title?: string;
  subtitle?: string;
}

/**
 * Hiển thị màn hình loading với phong cách glassmorphism,
 * được dùng cho cả initial load và onboarding.
 */
export function LoadingSplash({ title, subtitle }: LoadingSplashProps) {
  return (
    <main
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 ${backgroundGradient}`}
    >
      <FogOverlay />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.4, 0.6, 0.35], scale: [1, 1.05, 0.98] }}
        transition={accentTransition}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-md rounded-[28px] border-white/40 bg-white/20 p-8 shadow-[0_25px_60px_-18px_rgba(48,63,159,0.35)] sm:p-10 ${glass} ${glassLift}`}
      >
        <div className="space-y-4 text-center text-neutral-900">
          <div className="flex items-center justify-center">
            <BrandBadge />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {title ?? "Đang chuẩn bị không gian làm việc"}
          </h1>

          <p className="text-sm text-neutral-500" aria-live="polite">
            {subtitle ?? "Chúng tôi đang tải dữ liệu để đưa bạn đến WorkSphere. Chỉ mất một chút thôi."}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-3 w-3 rounded-full bg-primary"
              animate={{
                scale: [0.75, 1.15, 0.75],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                ...dotTransition,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
