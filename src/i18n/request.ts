import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the current locale from requestLocale
  const currentLocale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(currentLocale as any)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${currentLocale}.json`)).default,
  };
});
