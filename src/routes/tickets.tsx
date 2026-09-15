import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { TicketCard } from "@/components/content/TicketCard";
import { EmptyState } from "@/components/feedback/States";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PageHero } from "@/components/site/PageHero";
import { faqsQuery, ticketAvailabilityQuery, ticketTypesQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tickets")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(ticketTypesQuery()),
      context.queryClient.ensureQueryData(faqsQuery()),
      context.queryClient.ensureQueryData(ticketAvailabilityQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Tickets — WhenInKrusevo Festival" },
      {
        name: "description",
        content:
          "Day passes, three-day passes and camping bundles for WhenInKrusevo Festival in Krusevo, with prices in MKD.",
      },
      { property: "og:title", content: "Tickets — WhenInKrusevo Festival" },
      { property: "og:description", content: "Choose your pass for three days on the mountain." },
      { property: "og:url", content: "/tickets" },
    ],
    links: [{ rel: "canonical", href: "/tickets" }],
  }),
  component: TicketsPage,
});

function TicketsPage() {
  const { t, pick } = useI18n();
  const { data: tickets } = useSuspenseQuery(ticketTypesQuery());
  const { data: faqs } = useSuspenseQuery(faqsQuery());
  const { data: availability } = useSuspenseQuery(ticketAvailabilityQuery());
  const remainingById = new Map(availability.map((row) => [row.ticket_type_id, row.remaining]));
  const ticketFaqs = faqs.filter((faq) => faq.category === "tickets").slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={t("nav.tickets")}
        title={t("tickets.title")}
        description={t("tickets.subtitle")}
        image="/images/crowd.jpg"
      />

      <Section container="wide" spacing="md">
        {tickets.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {tickets.map((ticket, index) => (
              <Reveal key={ticket.id} delay={index * 60}>
                <TicketCard ticket={ticket} remaining={remainingById.get(ticket.id) ?? null} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
        <p className="mt-8 text-sm text-muted-foreground">{t("tickets.note")}</p>
      </Section>

      {ticketFaqs.length ? (
        <Section tone="muted" container="narrow" spacing="md">
          <SectionHeading eyebrow={t("nav.faq")} title={t("faq.title")} />
          <dl className="mt-10 divide-y divide-border border-y border-border">
            {ticketFaqs.map((faq) => (
              <div key={faq.id} className="py-6">
                <dt className="text-title">{pick(faq.question_mk, faq.question_en)}</dt>
                <dd className="text-body mt-3 text-muted-foreground">
                  {pick(faq.answer_mk, faq.answer_en)}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}
    </>
  );
}
