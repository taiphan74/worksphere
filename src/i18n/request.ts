import { getRequestConfig } from "next-intl/server";

import { routing, type AppLocale } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is a promise that resolves to the locale from the URL
  // It can be undefined if no locale is present in the URL
  const reqLocale = await requestLocale;

  // Validate and fallback to default locale
  const locale = routing.locales.includes(reqLocale as AppLocale)
    ? (reqLocale as AppLocale)
    : routing.defaultLocale;

  try {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default,
    };
  } catch (error) {
    // If the import fails (e.g. file missing), fallback to default locale messages
    console.warn(`Failed to load messages for locale "${locale}":`, error);
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../../messages/${routing.defaultLocale}.json`)).default,
    };
  }
});
