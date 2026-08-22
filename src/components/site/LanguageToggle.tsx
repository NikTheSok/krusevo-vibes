import { LOCALES, LOCALE_LABELS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ tone = "default" }: { tone?: "default" | "ink" }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        tone === "ink" ? "border-ink-border" : "border-border",
      )}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase transition-colors",
            locale === code
              ? "bg-primary text-primary-foreground"
              : tone === "ink"
                ? "text-ink-muted hover:text-ink-foreground"
                : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
