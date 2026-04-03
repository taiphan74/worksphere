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
          variant="glassLight"
          size="lg"
          className="h-14 rounded-full px-7 sm:px-8"
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
          className="h-14 rounded-full px-7 sm:px-8"
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
