import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const DEFAULT_LOCALE = "en";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeFromCookie = cookieStore.get("NEXT_LOCALE")?.value ?? "en";

  const locale = SUPPORTED_LOCALES.includes(localeFromCookie as "pt" | "en")
    ? localeFromCookie
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
