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

/**
 * Hiển thị wizard onboarding với các bước profile/workspace/success,
 * đảm bảo chỉ được phép chuyển giữa các bước đã hoàn thành và tự động skip khi cần.
 */
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
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("relative z-10 w-full max-w-lg rounded-[24px] p-8 sm:p-10", glass)}
      >
        {/* Progress bar with numbers */}
        <div className="mb-10 flex items-center justify-between gap-2">
          {steps.map((_, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const canNavigate = index <= currentStep;

            return (
              <button
                key={index}
                type="button"
                disabled={!canNavigate}
                onClick={() => canNavigate && setStep(index)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex-1 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                  canNavigate ? "cursor-pointer" : "cursor-not-allowed",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-primary/20 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
            );
          })}
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
