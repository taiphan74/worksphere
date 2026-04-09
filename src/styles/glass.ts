import { cn } from "@/lib/utils";

export const workspaceBackgroundGradient =
  "bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)]";

export const glassBase =
  "relative isolate overflow-hidden border backdrop-blur-xl backdrop-saturate-[180%] transition-all duration-300";

export const glassEffect =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent before:opacity-30 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_55%)] after:opacity-25";

// Enhanced glass effect for onboarding
export const enhancedGlassEffect =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/50 before:via-white/20 before:to-transparent before:opacity-40 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_60%)] after:opacity-30";

// Special glass effect with higher transparency for onboarding
export const onboardingGlass =
  cn(
    glassBase,
    "bg-white/15 border border-white/30 shadow-[0_32px_64px_-12px_rgba(86,110,148,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]",
    enhancedGlassEffect
  );

// Glass effect for inputs
export const inputGlassEffect =
  "bg-white/20 backdrop-blur-md border border-white/20 placeholder:text-white/60";

// Liquid button effect for onboarding
export const liquidButton =
  "rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white font-semibold shadow-[0_10px_20px_rgba(107,78,255,0.3),inset_0_2px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_rgba(107,78,255,0.4)] active:scale-95 transition-all duration-300";

export const glassLift = "hover:-translate-y-1";

export const glass = cn(glassBase, glassEffect);
