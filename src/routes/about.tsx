import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Mountain, Users } from "lucide-react";

import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PageHero } from "@/components/site/PageHero";
import { festivalQuery } from "@/lib/content/queries";
import type { FestivalStat } from "@/lib/content/types";
import { useI18n, type TranslationKey } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => context.queryClient.ensureQueryData(festivalQuery()),
  head: () => ({
    meta: [
      { title: "About the festival — VIDIK" },
      {
        name: "description",
        content:
          "VIDIK is an independent music, mountain and culture festival in Krusevo, built with local hosts, makers and mountaineers.",
      },
      { property: "og:title", content: "About the festival — VIDIK" },
      { property: "og:description", content: "How VIDIK is made, and with whom." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES: { icon: typeof Leaf; titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  {
    icon: Leaf,
    titleKey: "about.values.sustainability.title",
    bodyKey: "about.values.sustainability.body",
  },
  { icon: Users, titleKey: "about.values.community.title", bodyKey: "about.values.community.body" },
  { icon: Mountain, titleKey: "about.values.culture.title", bodyKey: "about.values.culture.body" },
];

function AboutPage() {
  const { t, pick } = useI18n();
  const { data: festival } = useSuspenseQuery(festivalQuery());
  const stats = (festival?.stats ?? []) as FestivalStat[];

  return (
    <>
      <PageHero
        eyebrow={t("home.intro.eyebrow")}
        title={t("about.title")}
        description={t("about.subtitle")}
        image="/images/folk-culture.jpg"
      />

      <Section container="wide" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-headline">{t("about.mission.title")}</h2>
          </Reveal>
          <Reveal delay={80} className="space-y-5">
            <p className="text-lead text-muted-foreground">{t("about.mission.body")}</p>
            <p className="text-body text-muted-foreground">
              {pick(festival?.description_mk, festival?.description_en)}
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" container="wide" spacing="lg">
        <SectionHeading eyebrow={t("home.intro.eyebrow")} title={t("about.subtitle")} />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {VALUES.map((value, index) => (
            <Reveal
              key={value.titleKey}
              delay={index * 60}
              className="rounded-3xl border border-border bg-card p-7"
            >
              <value.icon className="size-7 text-primary" aria-hidden="true" />
              <h3 className="text-title mt-5">{t(value.titleKey)}</h3>
              <p className="text-body mt-3 text-muted-foreground">{t(value.bodyKey)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {stats.length ? (
        <Section tone="ink" container="wide" spacing="md">
          <p className="text-eyebrow text-highlight">{t("home.stats.eyebrow")}</p>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.key}>
                <dd className="font-display text-4xl font-bold">{stat.value}</dd>
                <dt className="mt-2 text-sm text-ink-muted">{stat.key}</dt>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}
    </>
  );
}
