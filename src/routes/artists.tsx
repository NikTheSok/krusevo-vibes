import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ArtistCard } from "@/components/content/ArtistCard";
import { EmptyState } from "@/components/feedback/States";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { artistsQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/artists")({
  loader: ({ context }) => context.queryClient.ensureQueryData(artistsQuery()),
  head: () => ({
    meta: [
      { title: "Artists — WhenInKrusevo Festival" },
      {
        name: "description",
        content:
          "The WhenInKrusevo line-up: voices, rhythms and instruments from the Balkans and beyond, across three stages in Krusevo.",
      },
      { property: "og:title", content: "Artists — WhenInKrusevo Festival" },
      { property: "og:description", content: "Meet the line-up playing the mountain stages." },
      { property: "og:url", content: "/artists" },
    ],
    links: [{ rel: "canonical", href: "/artists" }],
  }),
  component: ArtistsPage,
});

function ArtistsPage() {
  const { t } = useI18n();
  const { data: artists } = useSuspenseQuery(artistsQuery());

  return (
    <>
      <PageHero
        eyebrow={t("home.artists.eyebrow")}
        title={t("artists.title")}
        description={t("artists.subtitle")}
        image="/images/crowd.jpg"
      />

      <Section container="wide" spacing="md">
        {artists.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist, index) => (
              <Reveal key={artist.id} delay={index * 50}>
                <ArtistCard artist={artist} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Section>
    </>
  );
}
