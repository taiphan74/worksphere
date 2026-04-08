import { NextIntlClientProvider } from "next-intl";
import NotFoundUI from "@/components/not-found-ui";
import { routing } from "@/i18n/routing";

// Trang 404 global
export default async function GlobalNotFound() {
  const locale = routing.defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFoundUI />
    </NextIntlClientProvider>
  );
}
