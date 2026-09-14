import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/States";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { orderQuery } from "@/lib/content/queries";
import { formatDateTime, formatPrice } from "@/lib/format";
import { useI18n, type TranslationKey } from "@/lib/i18n";

export const Route = createFileRoute("/order/$code")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(orderQuery(params.code));
  },
  head: () => ({
    meta: [
      { title: "Your order — WhenInKrusevo Festival" },
      {
        name: "description",
        content: "Your WhenInKrusevo Festival order details and entry code.",
      },
      { property: "og:title", content: "Your order — WhenInKrusevo Festival" },
      { property: "og:description", content: "Order details and entry code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  pendingComponent: () => <LoadingState className="min-h-[60vh]" />,
  errorComponent: () => <ErrorState className="m-8" />,
  notFoundComponent: () => <EmptyState className="m-8" />,
  component: OrderPage,
});

function OrderPage() {
  const { t, locale, pick } = useI18n();
  const { code } = Route.useParams();
  const { data: order } = useSuspenseQuery(orderQuery(code));

  if (!order) {
    return (
      <Section container="narrow" spacing="md">
        <EmptyState title={t("order.notfound.title")} description={t("order.notfound.body")} />
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link to="/tickets">{t("checkout.back")}</Link>
          </Button>
        </div>
      </Section>
    );
  }

  const statusKey = `orderStatus.${order.status}` as TranslationKey;

  return (
    <>
      <PageHero
        eyebrow={t("nav.tickets")}
        title={t("order.title")}
        description={t("order.subtitle")}
        image="/images/stars.jpg"
      />

      <Section container="narrow" spacing="md">
        <div className="rounded-3xl border border-border bg-card p-7">
          <p className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            <span className="text-eyebrow">{t(statusKey)}</span>
          </p>

          <p className="text-eyebrow mt-6 text-muted-foreground">{t("order.code")}</p>
          <p className="font-display text-3xl font-bold tracking-wide">{order.order_code}</p>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-eyebrow text-muted-foreground">{t("order.buyer")}</dt>
              <dd className="text-body mt-1">
                {order.buyer_name}
                <br />
                {order.buyer_email}
              </dd>
            </div>
            <div>
              <dt className="text-eyebrow text-muted-foreground">{t("order.date")}</dt>
              <dd className="text-body mt-1">{formatDateTime(order.created_at, locale)}</dd>
            </div>
          </dl>

          <h2 className="text-title mt-8 text-lg">{t("order.items")}</h2>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {order.items.map((item) => (
              <li key={item.id} className="text-body flex justify-between gap-3 py-3">
                <span>
                  {pick(item.name_mk, item.name_en)} × {item.quantity}
                </span>
                <span>
                  {formatPrice(item.unit_price_mkd * item.quantity, locale, order.currency)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex justify-between">
            <span className="text-eyebrow text-muted-foreground">{t("order.total")}</span>
            <span className="font-display text-2xl font-bold">
              {formatPrice(order.total_mkd, locale, order.currency)}
            </span>
          </div>

          <p className="text-body mt-8 text-muted-foreground">{t("order.entry")}</p>
          {!order.confirmation_email_sent_at ? (
            <p className="text-body mt-3 text-muted-foreground">{t("order.emailPending")}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/program">{t("cta.program")}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/contact">{t("nav.contact")}</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
