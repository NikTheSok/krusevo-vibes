import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/States";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTicketOrder } from "@/lib/content/orders.functions";
import { ticketAvailabilityQuery, ticketTypesQuery } from "@/lib/content/queries";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

type Search = { pass?: string | undefined };

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    pass: typeof search["pass"] === "string" ? search["pass"] : undefined,
  }),

  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(ticketTypesQuery()),
      context.queryClient.ensureQueryData(ticketAvailabilityQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Checkout — WhenInKrusevo Festival" },
      {
        name: "description",
        content:
          "Reserve your WhenInKrusevo Festival passes: choose your tickets, add your details and receive your order code.",
      },
      { property: "og:title", content: "Checkout — WhenInKrusevo Festival" },
      { property: "og:description", content: "Reserve your passes for three days in Krusevo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  pendingComponent: () => <LoadingState className="min-h-[60vh]" />,
  errorComponent: () => <ErrorState className="m-8" />,
  notFoundComponent: () => <EmptyState className="m-8" />,
  component: CheckoutPage,
});

function CheckoutPage() {
  const { t, locale, pick } = useI18n();
  const navigate = useNavigate();
  const { pass } = Route.useSearch();
  const { data: tickets } = useSuspenseQuery(ticketTypesQuery());
  const { data: availability } = useSuspenseQuery(ticketAvailabilityQuery());

  const remainingById = useMemo(
    () => new Map(availability.map((row) => [row.ticket_type_id, row.remaining])),
    [availability],
  );

  const sellable = tickets.filter(
    (ticket) => ticket.is_available && remainingById.get(ticket.id) !== 0,
  );

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const preselected = tickets.find((ticket) => ticket.slug === pass);
    return preselected ? { [preselected.id]: 1 } : {};
  });
  const [error, setError] = useState<string | null>(null);

  const lines = sellable
    .map((ticket) => ({ ticket, quantity: quantities[ticket.id] ?? 0 }))
    .filter((line) => line.quantity > 0);
  const total = lines.reduce(
    (sum, line) => sum + Number(line.ticket.price_mkd) * line.quantity,
    0,
  );
  const currency = sellable[0]?.currency ?? "MKD";

  const mutation = useMutation({
    mutationFn: (input: {
      buyer_name: string;
      buyer_email: string;
      buyer_phone: string;
      items: { ticket_type_id: string; quantity: number }[];
    }) => createTicketOrder({ data: { ...input, locale } }),
  });

  function setQuantity(id: string, next: number) {
    const max = remainingById.get(id);
    const capped = Math.max(0, Math.min(next, 10, typeof max === "number" ? max : 10));
    setQuantities((current) => ({ ...current, [id]: capped }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!lines.length) {
      setError(t("checkout.empty"));
      return;
    }
    const form = new FormData(event.currentTarget);
    try {
      const result = await mutation.mutateAsync({
        buyer_name: String(form.get("name") ?? "").trim(),
        buyer_email: String(form.get("email") ?? "").trim(),
        buyer_phone: String(form.get("phone") ?? "").trim(),
        items: lines.map((line) => ({ ticket_type_id: line.ticket.id, quantity: line.quantity })),
      });
      if (result.status === "created") {
        await navigate({ to: "/order/$code", params: { code: result.orderCode } });
        return;
      }
      setError(result.status === "unavailable" ? t("checkout.unavailable") : t("checkout.error"));
    } catch {
      setError(t("checkout.error"));
    }
  }

  return (
    <>
      <PageHero
        eyebrow={t("nav.tickets")}
        title={t("checkout.title")}
        description={t("checkout.subtitle")}
        image="/images/crowd.jpg"
      />

      <Section container="wide" spacing="md">
        {sellable.length === 0 ? (
          <EmptyState title={t("tickets.soldout")} />
        ) : (
          <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-8">
              <section aria-labelledby="pick-passes">
                <h2 id="pick-passes" className="text-title text-xl">
                  {t("checkout.step.select")}
                </h2>
                <ul className="mt-5 space-y-4">
                  {sellable.map((ticket) => {
                    const quantity = quantities[ticket.id] ?? 0;
                    const remaining = remainingById.get(ticket.id);
                    return (
                      <li
                        key={ticket.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
                      >
                        <div className="min-w-40">
                          <p className="text-title text-base">{pick(ticket.name_mk, ticket.name_en)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(Number(ticket.price_mkd), locale, ticket.currency)}
                            {typeof remaining === "number"
                              ? ` · ${remaining} ${t("tickets.left")}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`${t("checkout.quantity")} −`}
                            onClick={() => setQuantity(ticket.id, quantity - 1)}
                            disabled={quantity === 0}
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </Button>
                          <output
                            aria-label={`${pick(ticket.name_mk, ticket.name_en)} ${t("checkout.quantity")}`}
                            className="w-10 text-center font-display text-lg font-bold"
                          >
                            {quantity}
                          </output>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`${t("checkout.quantity")} +`}
                            onClick={() => setQuantity(ticket.id, quantity + 1)}
                          >
                            <Plus className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section aria-labelledby="buyer-details">
                <h2 id="buyer-details" className="text-title text-xl">
                  {t("checkout.step.details")}
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="buyer-name">{t("checkout.name")}</Label>
                    <Input id="buyer-name" name="name" required minLength={2} autoComplete="name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-email">{t("checkout.email")}</Label>
                    <Input id="buyer-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-phone">{t("checkout.phone")}</Label>
                    <Input id="buyer-phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="text-title text-lg">{t("checkout.summary")}</h2>
              {lines.length ? (
                <ul className="mt-5 space-y-3">
                  {lines.map((line) => (
                    <li key={line.ticket.id} className="text-body flex justify-between gap-3">
                      <span>
                        {pick(line.ticket.name_mk, line.ticket.name_en)} × {line.quantity}
                      </span>
                      <span>
                        {formatPrice(
                          Number(line.ticket.price_mkd) * line.quantity,
                          locale,
                          line.ticket.currency,
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-body mt-5 text-muted-foreground">{t("checkout.empty")}</p>
              )}

              <div className="mt-6 flex justify-between border-t border-border pt-4">
                <span className="text-eyebrow text-muted-foreground">{t("checkout.total")}</span>
                <span className="font-display text-2xl font-bold">
                  {formatPrice(total, locale, currency)}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{t("checkout.free")}</p>

              {error ? (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="highlight"
                className="mt-6 w-full"
                disabled={mutation.isPending || !lines.length}
              >
                {mutation.isPending ? t("form.sending") : t("checkout.submit")}
              </Button>

              <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
                <Link to="/tickets">{t("checkout.back")}</Link>
              </Button>
            </aside>
          </form>
        )}
      </Section>
    </>
  );
}
