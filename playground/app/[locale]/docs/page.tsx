import { docs as docsKo } from "@/content/docs/ko";
import { docs as docsEn } from "@/content/docs/en";
import { docs as docsZh } from "@/content/docs/zh";
import { docs as docsJa } from "@/content/docs/ja";
import { DocsContent } from "./DocsContent";
import type { Locale } from "@/i18n";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const docsMap = {
    ko: docsKo,
    en: docsEn,
    zh: docsZh,
    ja: docsJa,
  };

  const docs = docsMap[locale as Locale] || docsEn;

  return <DocsContent docs={docs} />;
}
