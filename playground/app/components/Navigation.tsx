"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: t("playground") },
    { href: "/docs", label: t("docs") },
    { href: "/api-reference", label: t("api") },
    { href: "/tutorial", label: t("tutorial") },
  ];

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      const currentPath = pathname.replace(`/${locale}`, "") || "/";
      router.push(`/${newLocale}${currentPath}`);
      setIsOpen(false);
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 z-50">
      <Link href="/" className="text-white font-bold text-lg mr-8">
        UIH DSL
      </Link>
      <div className="flex gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              pathname === `/${locale}${link.href}` ||
              (link.href === "/" && pathname === `/${locale}`)
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className="px-3 py-1.5 rounded text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {localeNames[locale as Locale]}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 py-1 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                  locale === loc ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
