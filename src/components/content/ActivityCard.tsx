import { Clock, Gauge, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ActivityWithLocation } from "@/lib/content/types";
import { formatDuration, formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function ActivityCard({ activity }: { activity: ActivityWithLocation }) {
  const { locale, pick, t } = useI18n();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lift">
      {activity.image_url ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={activity.image_url}
            alt={pick(activity.title_mk, activity.title_en) ?? ""}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {activity.category ? (
            <Badge className="absolute left-4 top-4" variant="secondary">
              {activity.category}
            </Badge>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-title">{pick(activity.title_mk, activity.title_en)}</h3>
        <p className="text-body mt-3 flex-1 text-muted-foreground">
          {pick(activity.description_mk, activity.description_en)}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          {activity.duration_minutes ? (
            <div className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">{t("activities.duration")}</dt>
              <dd>{formatDuration(activity.duration_minutes, locale)}</dd>
            </div>
          ) : null}
          {activity.difficulty ? (
            <div className="flex items-center gap-2">
              <Gauge className="size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">{t("activities.difficulty")}</dt>
              <dd>{activity.difficulty}</dd>
            </div>
          ) : null}
          {activity.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">{t("nav.locations")}</dt>
              <dd className="truncate">{activity.location.name}</dd>
            </div>
          ) : null}
          {activity.capacity ? (
            <div className="flex items-center gap-2">
              <Users className="size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">{t("activities.spots")}</dt>
              <dd>
                {activity.capacity} {t("activities.spots")}
              </dd>
            </div>
          ) : null}
        </dl>

        <p className="mt-6 font-display text-xl font-bold">
          {activity.price_mkd && Number(activity.price_mkd) > 0
            ? formatPrice(Number(activity.price_mkd), locale)
            : t("activities.reserve")}
        </p>
      </div>
    </article>
  );
}
