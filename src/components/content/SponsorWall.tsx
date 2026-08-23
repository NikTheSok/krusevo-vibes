import type { Sponsor } from "@/lib/content/types";

export function SponsorWall({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {sponsors.map((sponsor) => {
        const content = (
          <div className="flex h-24 items-center justify-center rounded-2xl border border-border bg-card px-5 text-center transition-colors hover:border-primary">
            {sponsor.logo_url ? (
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                loading="lazy"
                className="max-h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-lg font-bold">{sponsor.name}</span>
            )}
          </div>
        );
        return (
          <li key={sponsor.id}>
            {sponsor.website_url ? (
              <a href={sponsor.website_url} target="_blank" rel="noreferrer noopener" className="block">
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
