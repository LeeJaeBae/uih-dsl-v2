import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["ko", "en", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
  ja: "日本語",
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  let messages;
  switch (locale) {
    case "ko":
      messages = (await import("./messages/ko.json")).default;
      break;
    case "en":
      messages = (await import("./messages/en.json")).default;
      break;
    case "zh":
      messages = (await import("./messages/zh.json")).default;
      break;
    case "ja":
      messages = (await import("./messages/ja.json")).default;
      break;
    default:
      notFound();
  }

  return { messages, locale };
});
