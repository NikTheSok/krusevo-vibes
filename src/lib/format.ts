import type { Locale } from "@/lib/i18n";

const LOCALE_TAG: Record<Locale, string> = { mk: "mk-MK", en: "en-GB" };
export const FESTIVAL_TIME_ZONE = "Europe/Skopje";

export function formatTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FESTIVAL_TIME_ZONE,
  }).format(new Date(iso));
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
    timeZone: FESTIVAL_TIME_ZONE,
  }).format(new Date(iso));
}

export function formatWeekday(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    weekday: "long",
    timeZone: FESTIVAL_TIME_ZONE,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale: Locale): string {
  return `${formatDate(iso, locale)} · ${formatTime(iso, locale)}`;
}

export function formatDateRange(startIso: string, endIso: string, locale: Locale): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const day = new Intl.DateTimeFormat(LOCALE_TAG[locale], { day: "numeric", timeZone: FESTIVAL_TIME_ZONE });
  const full = new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: FESTIVAL_TIME_ZONE,
  });
  return `${day.format(start)} – ${full.format(end)}`;
}

/** Stable day key (YYYY-MM-DD in festival time) for grouping the programme. */
export function festivalDayKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: FESTIVAL_TIME_ZONE,
  }).format(new Date(iso));
}

export function formatPrice(amount: number | null, locale: Locale, currency = "MKD"): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(minutes: number | null, locale: Locale): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hourLabel = locale === "mk" ? "ч" : "h";
  const minuteLabel = locale === "mk" ? "мин" : "min";
  if (h && m) return `${h}${hourLabel} ${m}${minuteLabel}`;
  if (h) return `${h}${hourLabel}`;
  return `${m}${minuteLabel}`;
}
