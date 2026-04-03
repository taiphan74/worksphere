"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import { HeroCta } from "@/components/landing/hero-cta";

export function HeroHeadline() {
  const t = useTranslations("home");
  return <AnimatedHeroHeadline key={t("headline")} headline={t("headline")} />;
}

function AnimatedHeroHeadline({ headline }: { headline: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    let index = 0;
    let ctaTimeout: number | undefined;

    const interval = window.setInterval(() => {
      index += 1;
      setDisplayedText(headline.slice(0, index));

      if (index >= headline.length) {
        window.clearInterval(interval);
        ctaTimeout = window.setTimeout(() => setShowCta(true), 220);
      }
    }, 42);

    return () => {
      window.clearInterval(interval);
      if (ctaTimeout) window.clearTimeout(ctaTimeout);
    };
  }, [headline]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
      <motion.h1
        className="max-w-4xl text-center text-5xl font-semibold leading-[1.2] tracking-[-0.04em] sm:text-6xl md:text-7xl md:leading-[1.15] lg:text-[5.25rem]"
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
