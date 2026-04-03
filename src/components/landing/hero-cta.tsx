"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroCtaProps = {
  visible: boolean;
};

const itemTransition = { duration: 0.48, ease: "easeOut" as const };

export function HeroCta({ visible }: HeroCtaProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ ...itemTransition, delay: 0.08 }}
      >
        <Button
          asChild
          variant="glass"
          size="lg"
          className={cn(
            "h-14 rounded-full border-white/30 bg-white/10 px-7 text-[15px] font-semibold text-neutral-900 shadow-[0_20px_48px_rgba(86,110,148,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] before:from-white/70 before:via-white/30 before:to-transparent after:opacity-40 hover:bg-white/26 sm:px-8",
          )}
        >
          <Link href="/register">Bắt đầu miễn phí</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ ...itemTransition, delay: 0.22 }}
      >
        <Button
          asChild
          variant="glass"
          size="lg"
          className={cn(
            "h-14 rounded-full border-white/18 bg-black/48 px-7 text-[15px] font-medium text-white shadow-[0_20px_46px_rgba(42,47,60,0.24),inset_0_1px_0_rgba(255,255,255,0.18)] before:from-white/28 before:via-white/10 before:to-transparent after:opacity-18 hover:bg-black/40 sm:px-8",
          )}
        >
          <Link href="/demo" className="flex items-center gap-2">
            <Play className="size-[15px] fill-current" />
            <span>Xem bản demo</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
