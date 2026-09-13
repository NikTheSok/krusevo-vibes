import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { EmptyState } from "@/components/feedback/States";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqsQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery()),
  head: () => ({
    meta: [
      { title: "Frequently asked questions — WhenInKrusevo Festival" },
      {
        name: "description",
        content:
          "Answers about tickets, camping, accessibility, transport and what to pack for WhenInKrusevo Festival in Krusevo.",
      },
      { property: "og:title", content: "FAQ — WhenInKrusevo Festival" },
      { property: "og:description", content: "Everything practical before you travel to Krusevo." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { t, pick } = useI18n();
  const { data: faqs } = useSuspenseQuery(faqsQuery());

  const groups = useMemo(() => {
    const map = new Map<string, typeof faqs>();
    for (const faq of faqs) {
      const key = faq.category ?? "general";
      map.set(key, [...(map.get(key) ?? []), faq]);
    }
    return [...map.entries()];
  }, [faqs]);

  return (
    <>
      <PageHero
        eyebrow={t("nav.faq")}
        title={t("faq.title")}
        description={t("faq.subtitle")}
        image="/images/town.jpg"
      />

      <Section container="narrow" spacing="md">
        {groups.length ? (
          <div className="space-y-14">
            {groups.map(([category, items]) => (
              <div key={category}>
                <h2 className="text-eyebrow text-primary">{category}</h2>
                <Accordion type="single" collapsible className="mt-4">
                  {items.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left text-base font-semibold">
                        {pick(faq.question_mk, faq.question_en)}
                      </AccordionTrigger>
                      <AccordionContent className="text-body text-muted-foreground">
                        {pick(faq.answer_mk, faq.answer_en)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Section>
    </>
  );
}
