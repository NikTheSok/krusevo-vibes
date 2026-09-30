import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ActivityCard } from "@/components/content/ActivityCard";
import { ArtistCard } from "@/components/content/ArtistCard";
import { EventCard } from "@/components/content/EventCard";
import { GalleryGrid } from "@/components/content/GalleryGrid";
import { SponsorWall } from "@/components/content/SponsorWall";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Countdown } from "@/components/site/Countdown";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { EmptyState, ErrorState } from "@/components/feedback/States";
import { Button } from "@/components/ui/button";
import {
  activitiesQuery,
  artistsQuery,
  eventsQuery,
  festivalQuery,
  galleryQuery,
  sponsorsQuery,
} from "@/lib/content/queries";
import type { FestivalStat } from "@/lib/content/types";
import { formatDateRange } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(festivalQuery()),
      context.queryClient.ensureQueryData(eventsQuery()),
      context.queryClient.ensureQueryData(activitiesQuery()),
      context.queryClient.ensureQueryData(artistsQuery()),
      context.queryClient.ensureQueryData(galleryQuery()),
      context.queryClient.ensureQueryData(sponsorsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "WhenInKrusevo Festival 2027 — Music, mountain and culture in Krusevo" },
      {
        name: "description",
        content:
          "Three days of concerts, mountain adventures and local culture at 1350 metres in Krusevo, North Macedonia. Programme, artists, activities and tickets.",
      },
      { property: "og:title", content: "WhenInKrusevo Festival 2027 — Krusevo, North Macedonia" },
      {
        property: "og:description",
        content: "Concerts, trails, workshops and local flavours in the highest town in the Balkans.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
  errorComponent: () => <ErrorState className="mx-auto my-32 max-w-xl" />,
});

function HomePage() {
  const { t, locale, pick } = useI18n();
  const { data: festival } = useSuspenseQuery(festivalQuery());
  const { data: events } = useSuspenseQuery(eventsQuery());
  const { data: activities } = useSuspenseQuery(activitiesQuery());
  const { data: artists } = useSuspenseQuery(artistsQuery());
  const { data: gallery } = useSuspenseQuery(galleryQuery());
  const { data: sponsors } = useSuspenseQuery(sponsorsQuery());

  const stats = (festival?.stats ?? []) as FestivalStat[];
  const highlightEvents = events.filter((event) => event.is_featured).slice(0, 4);
  const programme = (highlightEvents.length ? highlightEvents : events).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-18 flex min-h-[92svh] items-end surface-ink">
        <img
          src={festival?.hero_image_url ?? "/images/hero-krusevo.jpg"}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="overlay-cinematic absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative pb-16 pt-32 sm:pb-24">
          <p className="text-eyebrow text-highlight">{t("brand.location")}</p>
          <h1 className="text-display mt-5 max-w-5xl">{festival?.name ?? t("brand.name")}</h1>
          <p className="text-lead mt-6 max-w-2xl text-ink-muted">
            {pick(festival?.tagline_mk, festival?.tagline_en) ?? t("home.intro.body")}
          </p>
          <p className="text-eyebrow mt-6">
            {festival
              ? formatDateRange(festival.start_date, festival.end_date, locale)
              : t("hero.dates")}
            {festival?.location_name ? ` · ${festival.location_name}` : ""}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="highlight" size="lg">
              <Link to="/tickets">{t("cta.tickets")}</Link>
            </Button>
            <Button asChild variant="onInk" size="lg">
              <Link to="/program">{t("cta.program")}</Link>
            </Button>
          </div>

          <div className="mt-12">
            <Countdown
              target={festival?.countdown_target ?? null}
              endDate={festival?.end_date ?? null}
            />
          </div>
        </Container>
      </section>

      {/* Intro + stats */}
      <Section spacing="lg" container="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-eyebrow text-primary">{t("home.intro.eyebrow")}</p>
            <h2 className="text-headline mt-4">{t("home.intro.title")}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-lead text-muted-foreground">
              {pick(festival?.description_mk, festival?.description_en) ?? t("home.intro.body")}
            </p>
            <Button asChild variant="link" className="mt-6 px-0">
              <Link to="/about">
                {t("cta.explore")} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        {stats.length ? (
          <Reveal className="mt-16">
            <p className="text-eyebrow text-muted-foreground">{t("home.stats.eyebrow")}</p>
            <dl className="mt-6 grid gap-6 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.key}>
                  <dd className="font-display text-4xl font-bold text-primary">{stat.value}</dd>
                  <dt className="mt-2 text-sm text-muted-foreground">{stat.key}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </Section>

      {/* Programme highlights */}
      <Section tone="muted" container="wide" spacing="lg">
        <SectionHeading
          eyebrow={t("home.program.eyebrow")}
          title={t("home.program.title")}
          action={
            <Button asChild variant="outline">
              <Link to="/program">{t("cta.all")}</Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {programme.length ? (
            programme.map((event, index) => (
              <Reveal key={event.id} delay={index * 60}>
                <EventCard event={event} />
              </Reveal>
            ))
          ) : (
            <EmptyState className="lg:col-span-2" />
          )}
        </div>
      </Section>

      {/* Activities */}
      <Section container="wide" spacing="lg">
        <SectionHeading
          eyebrow={t("home.activities.eyebrow")}
          title={t("home.activities.title")}
          action={
            <Button asChild variant="outline">
              <Link to="/activities">{t("cta.all")}</Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.slice(0, 3).map((activity, index) => (
            <Reveal key={activity.id} delay={index * 60}>
              <ActivityCard activity={activity} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Artists */}
      <Section tone="ink" container="wide" spacing="lg">
        <SectionHeading
          tone="ink"
          eyebrow={t("home.artists.eyebrow")}
          title={t("home.artists.title")}
          action={
            <Button asChild variant="onInk">
              <Link to="/artists">{t("cta.all")}</Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {artists.slice(0, 4).map((artist, index) => (
            <Reveal key={artist.id} delay={index * 60}>
              <ArtistCard artist={artist} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Destination */}
      <Section container="wide" spacing="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="overflow-hidden rounded-3xl">
            <img
              src="/images/town.jpg"
              alt="Stone and timber houses on the slopes of Krusevo"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="text-eyebrow text-primary">{t("home.destination.eyebrow")}</p>
            <h2 className="text-headline mt-4">{t("home.destination.title")}</h2>
            <p className="text-lead mt-5 text-muted-foreground">{t("home.destination.body")}</p>
            <Button asChild className="mt-8">
              <Link to="/locations">{t("nav.locations")}</Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* Gallery */}
      {gallery.length ? (
        <Section tone="muted" container="wide" spacing="lg">
          <SectionHeading
            eyebrow={t("home.gallery.eyebrow")}
            title={t("home.gallery.title")}
            action={
              <Button asChild variant="outline">
                <Link to="/gallery">{t("cta.all")}</Link>
              </Button>
            }
          />
          <GalleryGrid items={gallery.slice(0, 6)} className="mt-12" />
        </Section>
      ) : null}

      {/* Sponsors */}
      {sponsors.length ? (
        <Section container="wide" spacing="md">
          <SectionHeading
            align="center"
            eyebrow={t("home.sponsors.eyebrow")}
            title={t("home.sponsors.title")}
          />
          <div className="mt-12">
            <SponsorWall sponsors={sponsors} />
          </div>
        </Section>
      ) : null}

      {/* Newsletter */}
      <Section tone="ink" container="wide" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-headline">{t("home.newsletter.title")}</h2>
            <p className="text-lead mt-4 text-ink-muted">{t("home.newsletter.body")}</p>
          </div>
          <NewsletterForm />
        </div>
      </Section>
    </>
  );
}
