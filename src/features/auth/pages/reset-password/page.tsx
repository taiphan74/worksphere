import { getTranslations } from "next-intl/server";

import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { AuthPage } from "@/features/auth/components/auth-page";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export default async function ResetPasswordFeaturePage() {
  const t = await getTranslations("auth");

  return (
    <AuthPage
      title={t("resetPassword")}
      subtitle={t("resetPasswordSubtitle")}
    >
      <form className="space-y-4">
        <PasswordInput
          placeholder={t("newPasswordPlaceholder")}
          className={cn(
            "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
            glassEffect,
          )}
        />
        <PasswordInput
          placeholder={t("confirmPasswordPlaceholder")}
          className={cn(
            "border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
            glassEffect,
          )}
        />
        <Button
          type="button"
          variant="glass"
          className="h-12 w-full rounded-xl"
        >
          {t("updatePassword")}
        </Button>
      </form>

      <div className="mt-4 text-sm">
        <Link
          href="/login"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </AuthPage>
  );
}
