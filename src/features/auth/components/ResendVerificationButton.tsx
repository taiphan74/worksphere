"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type ResendVerificationButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  children?: string;
};

export function ResendVerificationButton({
  onClick,
  disabled,
  children,
}: ResendVerificationButtonProps) {
  const t = useTranslations("auth");

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto justify-start px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
      onClick={onClick}
      disabled={disabled}
    >
      {children ?? t("resendVerificationAction")}
    </Button>
  );
}
