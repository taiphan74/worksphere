"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { HeroCta } from "@/components/landing/hero-cta";

const headline = "Bring every team, task, and timeline into one workspace";

export function HeroHeadline() {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;
      setDisplayedText(headline.slice(0, index));

      if (index >= headline.length) {
        window.clearInterval(interval);
      }
    }, 42);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="mx-auto flex max-w-5xl flex-col items-center gap-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <BrandBadge />

      <h1 className="text-center text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
        <span>{displayedText}</span>
        <motion.span
          className="ml-1 inline-block text-primary"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          |
        </motion.span>
      </h1>

      <HeroCta />
    </motion.div>
  );
}
