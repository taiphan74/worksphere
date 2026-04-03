import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthPage } from "@/features/auth/components/auth-page";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

export default async function ForgotPasswordFeaturePage() {
  const t = await getTranslations("auth");

  return (
    <AuthPage
      title={t("forgotPassword")}
      subtitle={t("forgotPasswordSubtitle")}
    >
      <form className="space-y-4">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className={cn(
            "h-12 rounded-xl border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground backdrop-blur-md",
            glassEffect,
          )}
        />
        <Button
          type="button"
          variant="glass"
          className="h-12 w-full rounded-xl"
        >
          {t("sendRequest")}
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
