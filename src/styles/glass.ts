import { cn } from "@/lib/utils";

export const glassBase =
  "relative isolate overflow-hidden border backdrop-blur-xl backdrop-saturate-[180%] transition-all duration-300";

export const glassEffect =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent before:opacity-30 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_55%)] after:opacity-25";

export const glassLift = "hover:-translate-y-1";

export const glass = cn(glassBase, glassEffect);
