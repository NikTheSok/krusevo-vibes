import { useEffect, useState } from "react";

import { useI18n, type TranslationKey } from "@/lib/i18n";

type Remaining = { days: number; hours: number; minutes: number; seconds: number } | "live" | "ended";

const UNITS: { key: keyof Exclude<Remaining, string>; labelKey: TranslationKey }[] = [
  { key: "days", labelKey: "countdown.days" },
  { key: "hours", labelKey: "countdown.hours" },
  { key: "minutes", labelKey: "countdown.minutes" },
  { key: "seconds", labelKey: "countdown.seconds" },
];

function compute(target: string, end: string | null): Remaining {
  const now = Date.now();
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) {
    if (end && new Date(end).getTime() + 86_400_000 > now) return "live";
    return "ended";
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Client-only countdown: rendered after hydration to avoid SSR clock drift. */
export function Countdown({ target, endDate }: { target: string | null; endDate?: string | null }) {
  const { t } = useI18n();
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    if (!target) return;
    const tick = () => setRemaining(compute(target, endDate ?? null));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target, endDate]);

  if (!target) return null;

  if (remaining === null) {
    return <p className="text-body text-ink-muted">{t("countdown.loading")}</p>;
  }

  if (remaining === "live" || remaining === "ended") {
    return (
      <p className="text-title text-highlight">
        {remaining === "live" ? t("countdown.live") : t("countdown.ended")}
      </p>
    );
  }

  return (
    <div>
      <p className="text-eyebrow text-highlight">{t("countdown.title")}</p>
      <dl className="mt-4 grid max-w-lg grid-cols-4 gap-3">
        {UNITS.map((unit) => (
          <div
            key={unit.key}
            className="rounded-2xl border border-ink-border bg-ink/40 px-2 py-4 text-center backdrop-blur"
          >
            <dd className="font-display text-3xl font-bold tabular-nums sm:text-4xl">
              {String(remaining[unit.key]).padStart(2, "0")}
            </dd>
            <dt className="mt-1 text-[0.65rem] font-semibold tracking-widest uppercase text-ink-muted">
              {t(unit.labelKey)}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
