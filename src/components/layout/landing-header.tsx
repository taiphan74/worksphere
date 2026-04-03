import { useTranslations } from "next-intl";

import { BrandBadge } from "@/components/brand/brand-badge";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glass } from "@/styles/glass";

export function LandingHeader() {
  const t = useTranslations("home");

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-5">
        <div
          className={cn(
            glass,
            "justify-between rounded-full border-white/30 bg-white/14 px-4 py-3 text-neutral-900 shadow-[0_16px_40px_rgba(82,99,132,0.16),inset_0_1px_0_rgba(255,255,255,0.45)] sm:px-5",
            "flex items-center",
          )}
        >
          <Link href="/" className="flex items-center">
            <BrandBadge />
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              asChild
              variant="glass"
              className={cn(
                "h-10 rounded-full border-white/28 bg-white/10 px-5 text-sm text-neutral-900 shadow-[0_10px_28px_rgba(82,99,132,0.14),inset_0_1px_0_rgba(255,255,255,0.45)] before:from-white/65 before:via-white/25 before:to-transparent after:opacity-35 hover:bg-white/28",
              )}
            >
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
