"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

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
          size="lg"
          className="h-14 rounded-full bg-white px-7 text-[15px] font-semibold text-neutral-900 shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5 hover:bg-white/95 sm:px-8"
        >
          <Link href="/signup">Start for Free</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ ...itemTransition, delay: 0.22 }}
      >
        <Button
          asChild
          size="lg"
          className="h-14 rounded-full border border-white/12 bg-black/78 px-7 text-[15px] font-medium text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-black/84 sm:px-8"
        >
          <Link href="/demo">
            <Play className="size-[15px] fill-current" />
            Watch Demo
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
