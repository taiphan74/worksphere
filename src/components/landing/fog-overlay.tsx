"use client";

import { motion } from "motion/react";

const mistTransition = {
  duration: 18,
  repeat: Number.POSITIVE_INFINITY,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

export function FogOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-[-12%] left-[-10%] h-[44vh] w-[44vh] rounded-full bg-black/10 blur-3xl md:h-[56vh] md:w-[56vh]"
        animate={{
          x: [0, 80, 28],
          y: [0, 22, -12],
          scale: [1, 1.12, 0.98],
          rotate: [0, 8, -4],
        }}
        transition={mistTransition}
      />

      <motion.div
        className="absolute right-[-16%] bottom-[-8%] h-[38vh] w-[48vh] rounded-full bg-black/12 blur-3xl md:h-[46vh] md:w-[62vh]"
        animate={{
          x: [0, -72, -24],
          y: [0, -18, 12],
          scale: [1, 1.08, 0.96],
          rotate: [0, -6, 3],
        }}
        transition={{
          ...mistTransition,
          duration: 22,
        }}
      />

      <motion.div
        className="absolute top-[28%] left-[50%] h-[26vh] w-[62vw] -translate-x-1/2 rounded-full bg-gradient-to-r from-black/0 via-black/8 to-black/0 blur-3xl md:h-[30vh]"
        animate={{
          x: ["-6%", "6%", "-3%"],
          y: [0, 12, -8],
          scaleX: [1, 1.06, 0.98],
          opacity: [0.35, 0.5, 0.38],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
