"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export function HeroCta() {
  return (
    <motion.div
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
    >
      <Button
        asChild
        size="lg"
        className="h-13 rounded-full bg-white px-8 text-sm font-semibold text-neutral-900 shadow-[0_14px_34px_rgba(255,255,255,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-white/95"
      >
        <Link href="/signup">Start for Free</Link>
      </Button>

      <Button
        asChild
        size="lg"
        className="h-13 rounded-full border border-white/12 bg-black/78 px-8 text-sm font-medium text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-md transition-transform hover:-translate-y-0.5 hover:bg-black/84"
      >
        <Link href="/demo">
          <Play className="size-4 fill-current" />
          Watch Demo
        </Link>
      </Button>
    </motion.div>
  );
}
