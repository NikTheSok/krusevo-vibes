import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { LocationCard } from "@/components/content/LocationCard";
import { EmptyState } from "@/components/feedback/States";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { locationsQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/locations")({
  loader: ({ context }) => context.queryClient.ensureQueryData(locationsQuery()),
  head: () => ({
    meta: [
      { title: "Locations — VIDIK Festival" },
      {
        name: "description",
        content:
          "Stages and venues across Krusevo: the meadow main stage, the old bazaar, Mechkin Kamen and the sunrise viewpoint.",
      },
      { property: "og:title", content: "Locations — VIDIK Festival" },
      { property: "og:description", content: "Where every part of the festival happens." },
      { property: "og:url", content: "/locations" },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  const { t } = useI18n();
  const { data: locations } = useSuspenseQuery(locationsQuery());

  return (
    <>
      <PageHero
        eyebrow={t("nav.locations")}
        title={t("locations.title")}
        description={t("locations.subtitle")}
        image="/images/paragliding.jpg"
      />
      <Section container="wide" spacing="md">
        {locations.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location, index) => (
              <Reveal key={location.id} delay={index * 50}>
                <LocationCard location={location} />
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
