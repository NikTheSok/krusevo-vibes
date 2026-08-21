import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  DEFAULT_LOCALE,
  LOCALES,
  translations,
  type Locale,
  type TranslationKey,
} from "./translations";

export { LOCALES, LOCALE_LABELS, DEFAULT_LOCALE } from "./translations";
export type { Locale, TranslationKey } from "./translations";

const STORAGE_KEY = "vidik.locale";

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  /** Picks the right column from a bilingual database record. */
  pick: <T>(mk: T | null | undefined, en: T | null | undefined) => T | null;
};

const I18nContext = createContext<I18nValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Server render always uses the default locale; the stored preference is
  // applied after hydration to avoid a mismatch.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); language still switches.
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translations[locale][key] ?? translations[DEFAULT_LOCALE][key] ?? key,
      pick: (mk, en) => (locale === "mk" ? (mk ?? en ?? null) : (en ?? mk ?? null)),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
