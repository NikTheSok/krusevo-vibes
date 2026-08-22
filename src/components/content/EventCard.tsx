import { Badge } from "@/components/ui/badge";
import type { EventWithRelations } from "@/lib/content/types";
import { formatTime } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function EventCard({ event }: { event: EventWithRelations }) {
  const { locale, pick } = useI18n();

  return (
    <article className="group grid gap-4 rounded-3xl border border-border bg-card p-5 transition-shadow hover:shadow-card sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:p-6">
      <p className="font-display text-2xl font-bold tabular-nums text-primary sm:w-24">
        {formatTime(event.starts_at, locale)}
      </p>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {event.category ? <Badge variant="secondary">{event.category}</Badge> : null}
          {event.location ? (
            <span className="text-sm text-muted-foreground">{event.location.name}</span>
          ) : null}
        </div>
        <h3 className="text-title mt-3">{pick(event.title_mk, event.title_en)}</h3>
        {event.description_mk || event.description_en ? (
          <p className="text-body mt-2 text-muted-foreground">
            {pick(event.description_mk, event.description_en)}
          </p>
        ) : null}
        {event.artist ? (
          <p className="mt-3 text-sm font-semibold text-foreground">{event.artist.name}</p>
        ) : null}
      </div>
    </article>
  );
}
