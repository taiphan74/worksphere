"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "../../hooks/useOnboarding";
import { CheckCircle2 } from "lucide-react";

export function StepSuccess() {
  const t = useTranslations("onboarding");
  const { finishOnboarding } = useOnboarding();

  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-emerald-100 p-3">
          <CheckCircle2 className="size-12 text-emerald-600" />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">{t("successTitle")}</h2>
        <p className="mt-2 text-neutral-600">{t("successSubtitle")}</p>
      </div>

      <Button
        onClick={finishOnboarding}
        variant="glass"
        className="h-12 w-full rounded-xl"
      >
        {t("getStarted")}
      </Button>
    </div>
  );
}
