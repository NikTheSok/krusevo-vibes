import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { GalleryGrid } from "@/components/content/GalleryGrid";
import { EmptyState } from "@/components/feedback/States";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { galleryQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/gallery")({
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery()),
  head: () => ({
    meta: [
      { title: "Gallery — WhenInKrusevo Festival" },
      {
        name: "description",
        content: "Photographs from the mountain trails, the night stages and the old bazaar of Krusevo.",
      },
      { property: "og:title", content: "Gallery — WhenInKrusevo Festival" },
      { property: "og:description", content: "The atmosphere of WhenInKrusevo in pictures." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t } = useI18n();
  const { data: items } = useSuspenseQuery(galleryQuery());

  return (
    <>
      <PageHero
        eyebrow={t("home.gallery.eyebrow")}
        title={t("gallery.title")}
        description={t("gallery.subtitle")}
        image="/images/stars.jpg"
      />
      <Section container="wide" spacing="md">
        {items.length ? <GalleryGrid items={items} /> : <EmptyState />}
      </Section>
    </>
  );
}
