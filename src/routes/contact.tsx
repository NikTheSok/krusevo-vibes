import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Newspaper, Phone } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { siteSettingsQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteSettingsQuery()),
  head: () => ({
    meta: [
      { title: "Contact — VIDIK Festival" },
      {
        name: "description",
        content:
          "Contact the VIDIK Festival team in Krusevo about tickets, accommodation, partnerships or press accreditation.",
      },
      { property: "og:title", content: "Contact — VIDIK Festival" },
      { property: "og:description", content: "Talk to the festival team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const { data: settings } = useSuspenseQuery(siteSettingsQuery());
  const { contact } = settings;

  const details = [
    { icon: Mail, label: t("contact.form.email"), value: contact.email, href: `mailto:${contact.email}` },
    { icon: Newspaper, label: "Press", value: contact.press, href: `mailto:${contact.press}` },
    { icon: Phone, label: "Tel.", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: t("nav.locations"), value: contact.address, href: null },
  ].filter((item) => Boolean(item.value));

  return (
    <>
      <PageHero
        eyebrow={t("footer.contact")}
        title={t("contact.title")}
        description={t("contact.subtitle")}
        image="/images/town.jpg"
      />

      <Section container="wide" spacing="md">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <ContactForm />

          <aside className="rounded-3xl border border-border bg-muted p-7">
            <h2 className="text-title">{t("contact.info.title")}</h2>
            <ul className="mt-6 space-y-5">
              {details.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <item.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-eyebrow text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-body underline-offset-4 hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-body">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
