import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TicketType } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function TicketCard({ ticket }: { ticket: TicketType }) {
  const { locale, pick, t } = useI18n();
  const perks = (locale === "mk" ? ticket.perks_mk : ticket.perks_en) ?? [];

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl border p-7",
        ticket.is_featured ? "border-primary bg-card shadow-lift" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-title">{pick(ticket.name_mk, ticket.name_en)}</h3>
        {!ticket.is_available ? <Badge variant="destructive">{t("tickets.soldout")}</Badge> : null}
      </div>

      <p className="mt-4 font-display text-4xl font-bold">
        {formatPrice(Number(ticket.price_mkd), locale, ticket.currency)}
      </p>

      <p className="text-body mt-3 text-muted-foreground">
        {pick(ticket.description_mk, ticket.description_en)}
      </p>

      {perks.length ? (
        <div className="mt-6">
          <p className="text-eyebrow text-muted-foreground">{t("tickets.perks")}</p>
          <ul className="mt-3 space-y-2">
            {perks.map((perk) => (
              <li key={perk} className="text-body flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex-1" />

      {ticket.capacity ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {t("tickets.capacity")}: {ticket.capacity}
        </p>
      ) : null}

      <Button variant={ticket.is_featured ? "highlight" : "default"} disabled={!ticket.is_available}>
        {ticket.is_available ? t("tickets.select") : t("tickets.soldout")}
      </Button>
    </article>
  );
}
