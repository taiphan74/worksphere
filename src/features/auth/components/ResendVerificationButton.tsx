"use client";

import { Button } from "@/components/ui/button";

type ResendVerificationButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export function ResendVerificationButton({
  onClick,
  disabled,
}: ResendVerificationButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto justify-start px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
      onClick={onClick}
      disabled={disabled}
    >
      Gửi lại email xác minh
    </Button>
  );
}
