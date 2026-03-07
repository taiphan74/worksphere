"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { HeroCta } from "@/components/landing/hero-cta";

const headline = "Bring every team, task, and timeline into one workspace";

export function HeroHeadline() {
  const [displayedText, setDisplayedText] = useState("");
  const [showBrand, setShowBrand] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    let index = 0;
    let brandTimeout: number | undefined;
    let ctaTimeout: number | undefined;

    const interval = window.setInterval(() => {
      index += 1;
      setDisplayedText(headline.slice(0, index));

      if (index >= headline.length) {
        window.clearInterval(interval);
        brandTimeout = window.setTimeout(() => setShowBrand(true), 120);
        ctaTimeout = window.setTimeout(() => setShowCta(true), 260);
      }
    }, 42);

    return () => {
      window.clearInterval(interval);
      if (brandTimeout) window.clearTimeout(brandTimeout);
      if (ctaTimeout) window.clearTimeout(ctaTimeout);
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={showBrand ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.48, ease: "easeOut" }}
      >
        <BrandBadge />
      </motion.div>

      <motion.h1
        className="max-w-4xl text-center text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl md:leading-[0.96] lg:text-[5.25rem]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span>{displayedText}</span>
        <motion.span
          className="ml-1 inline-block align-baseline text-primary"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          |
        </motion.span>
      </motion.h1>

      <HeroCta visible={showCta} />
    </div>
  );
}
