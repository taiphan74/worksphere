"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  const search = searchParams.toString();
  const href = search ? `${pathname}?${search}` : pathname;

  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur-md", className)}>
      {routing.locales.map((targetLocale) => {
        const isActive = targetLocale === locale;

        return (
          <Link
            key={targetLocale}
            href={href}
            locale={targetLocale}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.14em] transition-colors",
              isActive
                ? "bg-white/80 text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            {t(targetLocale === "vi" ? "localeVi" : "localeEn")}
          </Link>
        );
      })}
    </div>
  );
}
