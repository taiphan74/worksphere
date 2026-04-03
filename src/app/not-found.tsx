"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)]">
      {/* Background grain texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <FogOverlay />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase"
        >
          404 Not Found
        </motion.span>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 sm:text-7xl">
          Oops! Page Not Found
        </h1>

        <p className="mb-10 max-w-[480px] text-lg leading-relaxed text-neutral-600/90">
          The page you are looking for doesn't exist. Click button below to go to the homepage.
        </p>

        <Button
          asChild
          variant="glass"
          size="lg"
          className={cn(
            "h-14 rounded-full border-white/18 bg-black/85 px-8 text-[15px] font-medium text-white shadow-[0_20px_46px_rgba(42,47,60,0.24),inset_0_1px_0_rgba(255,255,255,0.18)] before:from-white/28 before:via-white/10 before:to-transparent after:opacity-18 hover:bg-black/90 hover:scale-105 active:scale-95 transition-all duration-300",
          )}
        >
          <Link href="/">Back to Homepage</Link>
        </Button>
      </motion.div>

      {/* Decorative center glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[140px]" />
    </main>
  );
}
