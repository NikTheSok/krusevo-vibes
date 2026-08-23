import { MapPin } from "lucide-react";

import type { FestivalLocation } from "@/lib/content/types";
import { useI18n } from "@/lib/i18n";

export function LocationCard({ location }: { location: FestivalLocation }) {
  const { pick, t } = useI18n();
  const hasCoords = location.latitude !== null && location.longitude !== null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      {location.image_url ? (
        <img
          src={location.image_url}
          alt={location.name}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-title">{location.name}</h3>
        {location.address ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {location.address}
          </p>
        ) : null}
        <p className="text-body mt-4 flex-1 text-muted-foreground">
          {pick(location.description_mk, location.description_en)}
        </p>
        {hasCoords ? (
          <a
            className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=16/${location.latitude}/${location.longitude}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t("locations.map")}: {Number(location.latitude).toFixed(4)},{" "}
            {Number(location.longitude).toFixed(4)}
          </a>
        ) : null}
      </div>
    </article>
  );
}
