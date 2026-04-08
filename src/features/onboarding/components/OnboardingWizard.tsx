"use client";

import { motion, AnimatePresence } from "motion/react";
import { useOnboardingStore } from "../store/use-onboarding-store";
import { StepProfile } from "./steps/StepProfile";
import { StepWorkspace } from "./steps/StepWorkspace";
import { StepSuccess } from "./steps/StepSuccess";
import { glass } from "@/styles/glass";
import { cn } from "@/lib/utils";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const steps = [
  { id: "profile", component: <StepProfile /> },
  { id: "workspace", component: <StepWorkspace /> },
  { id: "success", component: <StepSuccess /> },
];

export function OnboardingWizard() {
  const { currentStep } = useOnboardingStore();
  const { isLoading, isOnboardingComplete, currentUser } = useOnboardingStatus();
  const router = useRouter();
  const t = useTranslations("onboarding");
  const setStep = useOnboardingStore((state) => state.setStep);

  // Auto-skip logic based on existing data
  useEffect(() => {
    if (isLoading) return;

    if (isOnboardingComplete) {
      router.push("/");
      return;
    }

    // Tự động bỏ qua bước profile nếu đã có fullName
    if (currentUser?.fullName && currentStep === 0) {
      setStep(1);
    }
  }, [isLoading, isOnboardingComplete, currentUser, currentStep, setStep, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">{t("loading")}</div>
      </main>
    );
  }

  // Nếu đã complete thì không render gì cả vì useEffect sẽ redirect
  if (isOnboardingComplete) {
    return null;
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)] p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("relative z-10 w-full max-w-lg rounded-[24px] border border-white/40 bg-white/40 p-6 sm:p-10 shadow-[0_32px_64px_-12px_rgba(86,110,148,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl", glass)}
      >
        {/* Progress bar */}
        <div className="mb-10 flex justify-between gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                index <= currentStep ? "bg-primary" : "bg-primary/20"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {steps[currentStep].component}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
