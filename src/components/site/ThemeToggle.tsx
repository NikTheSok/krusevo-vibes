import { Monitor, Moon, Sun } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { THEMES, useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABEL_KEYS = {
  light: "theme.light",
  dark: "theme.dark",
  system: "theme.system",
} as const;

export function ThemeToggle({ tone = "default" }: { tone?: "default" | "ink" }) {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label={t("theme.label")}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        tone === "ink" ? "border-ink-border" : "border-border",
      )}
    >
      {THEMES.map((code) => {
        const Icon = ICONS[code];
        const active = theme === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setTheme(code)}
            aria-pressed={active}
            title={t(LABEL_KEYS[code])}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : tone === "ink"
                  ? "text-ink-muted hover:text-ink-foreground"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span className="sr-only">{t(LABEL_KEYS[code])}</span>
          </button>
        );
      })}
    </div>
  );
}
