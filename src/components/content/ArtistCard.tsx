import { Badge } from "@/components/ui/badge";
import type { Artist } from "@/lib/content/types";
import { useI18n } from "@/lib/i18n";

export function ArtistCard({ artist }: { artist: Artist }) {
  const { pick } = useI18n();

  return (
    <article className="group relative overflow-hidden rounded-3xl surface-ink">
      <div className="aspect-[3/4] overflow-hidden">
        {artist.image_url ? (
          <img
            src={artist.image_url}
            alt={artist.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="overlay-card pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {artist.genre ? <Badge variant="secondary">{artist.genre}</Badge> : null}
          {artist.country ? <span className="text-xs text-ink-muted">{artist.country}</span> : null}
        </div>
        <h3 className="text-title mt-2 text-ink-foreground">{artist.name}</h3>
        {artist.stage ? <p className="mt-1 text-sm text-highlight">{artist.stage}</p> : null}
        {artist.bio_mk || artist.bio_en ? (
          <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{pick(artist.bio_mk, artist.bio_en)}</p>
        ) : null}
      </div>
    </article>
  );
}
