import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/content/EventCard";
import { EmptyState } from "@/components/feedback/States";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { eventsQuery } from "@/lib/content/queries";
import { festivalDayKey, formatDate, formatWeekday } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/program")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery()),
  head: () => ({
    meta: [
      { title: "Programme — WhenInKrusevo Festival" },
      {
        name: "description",
        content:
          "Day-by-day WhenInKrusevo programme: main stage concerts, bazaar sessions, workshops and sunrise events in Krusevo.",
      },
      { property: "og:title", content: "Programme — WhenInKrusevo Festival" },
      {
        property: "og:description",
        content: "Three festival days of concerts, workshops and cultural events.",
      },
      { property: "og:url", content: "/program" },
    ],
    links: [{ rel: "canonical", href: "/program" }],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { t, locale } = useI18n();
  const { data: events } = useSuspenseQuery(eventsQuery());
  const [day, setDay] = useState<string | "all">("all");

  const days = useMemo(() => {
    const keys = new Set<string>();
    for (const event of events) keys.add(festivalDayKey(event.starts_at));
    return [...keys].sort();
  }, [events]);

  const visible = day === "all" ? events : events.filter((e) => festivalDayKey(e.starts_at) === day);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const event of visible) {
      const key = festivalDayKey(event.starts_at);
      map.set(key, [...(map.get(key) ?? []), event]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [visible]);

  return (
    <>
      <PageHero
        eyebrow={t("home.program.eyebrow")}
        title={t("program.title")}
        description={t("program.subtitle")}
        image="/images/stage-night.jpg"
      />

      <Section container="wide" spacing="md">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("program.day")}>
          <Button
            variant={day === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setDay("all")}
            aria-pressed={day === "all"}
          >
            {t("program.allDays")}
          </Button>
          {days.map((key, index) => (
            <Button
              key={key}
              variant={day === key ? "default" : "outline"}
              size="sm"
              onClick={() => setDay(key)}
              aria-pressed={day === key}
            >
              {t("program.day")} {index + 1} · {formatDate(`${key}T12:00:00Z`, locale)}
            </Button>
          ))}
        </div>

        {grouped.length ? (
          <div className="mt-12 space-y-16">
            {grouped.map(([key, dayEvents]) => (
              <div key={key}>
                <h2 className="text-title border-b border-border pb-4">
                  <span className="text-primary">{formatWeekday(`${key}T12:00:00Z`, locale)}</span>{" "}
                  {formatDate(`${key}T12:00:00Z`, locale)}
                </h2>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {dayEvents.map((event, index) => (
                    <Reveal key={event.id} delay={index * 50}>
                      <EventCard event={event} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState className="mt-12" />
        )}
      </Section>
    </>
  );
}
