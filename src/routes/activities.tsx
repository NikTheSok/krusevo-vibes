import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ActivityCard } from "@/components/content/ActivityCard";
import { EmptyState } from "@/components/feedback/States";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { activitiesQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/activities")({
  loader: ({ context }) => context.queryClient.ensureQueryData(activitiesQuery()),
  head: () => ({
    meta: [
      { title: "Activities — WhenInKrusevo Festival" },
      {
        name: "description",
        content:
          "Paragliding, sunrise hikes, weaving workshops and tasting tours around the WhenInKrusevo festival in Krusevo.",
      },
      { property: "og:title", content: "Activities — WhenInKrusevo Festival" },
      {
        property: "og:description",
        content: "Mountain, culture and local experiences before and between the concerts.",
      },
      { property: "og:url", content: "/activities" },
    ],
    links: [{ rel: "canonical", href: "/activities" }],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const { t } = useI18n();
  const { data: activities } = useSuspenseQuery(activitiesQuery());
  const [category, setCategory] = useState<string | "all">("all");

  const categories = useMemo(
    () => [...new Set(activities.map((a) => a.category).filter((c): c is string => Boolean(c)))],
    [activities],
  );

  const visible = category === "all" ? activities : activities.filter((a) => a.category === category);

  return (
    <>
      <PageHero
        eyebrow={t("home.activities.eyebrow")}
        title={t("activities.title")}
        description={t("activities.subtitle")}
        image="/images/mountain-trail.jpg"
      />

      <Section container="wide" spacing="md">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("activities.allCategories")}>
          <Button
            variant={category === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
          >
            {t("activities.allCategories")}
          </Button>
          {categories.map((item) => (
            <Button
              key={item}
              variant={category === item ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </Button>
          ))}
        </div>

        {visible.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((activity, index) => (
              <Reveal key={activity.id} delay={index * 50}>
                <ActivityCard activity={activity} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState className="mt-12" />
        )}
      </Section>
    </>
  );
}
