import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { adminOverviewQuery } from "@/lib/content/admin-queries";
import type { AdminOverview } from "@/lib/content/admin.functions";
import { formatDateTime } from "@/lib/format";
import { useI18n, type TranslationKey } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — VIDIK admin" },
      { name: "description", content: "Content overview for the VIDIK Festival team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

const COUNTS: { key: keyof AdminOverview["counts"]; labelKey: TranslationKey }[] = [
  { key: "events", labelKey: "admin.nav.program" },
  { key: "activities", labelKey: "admin.nav.activities" },
  { key: "artists", labelKey: "admin.nav.artists" },
  { key: "gallery", labelKey: "admin.nav.gallery" },
  { key: "locations", labelKey: "admin.nav.locations" },
  { key: "tickets", labelKey: "admin.nav.tickets" },
  { key: "messages", labelKey: "admin.nav.messages" },
  { key: "subscribers", labelKey: "admin.nav.subscribers" },
];

function AdminDashboard() {
  const { t, locale, pick } = useI18n();
  const { data: overview } = useSuspenseQuery(adminOverviewQuery());

  return (
    <AdminShell
      title={t("admin.dashboard.title")}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/messages">
            {t("admin.nav.messages")} · {overview.counts.newMessages}
          </Link>
        </Button>
      }
    >
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COUNTS.map((item) => (
          <div key={item.key} className="rounded-2xl border border-border bg-card p-5">
            <dt className="text-eyebrow text-muted-foreground">{t(item.labelKey)}</dt>
            <dd className="font-display mt-3 text-3xl font-bold">{overview.counts[item.key]}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-title text-lg">{t("admin.dashboard.upcoming")}</h2>
          <ul className="mt-4 divide-y divide-border">
            {overview.upcomingEvents.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-body font-medium">{pick(event.title_mk, event.title_en)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(event.starts_at, locale)}
                  </p>
                </div>
                <StatusBadge published={event.is_published} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-title text-lg">{t("admin.dashboard.messages")}</h2>
          <ul className="mt-4 divide-y divide-border">
            {overview.recentMessages.map((message) => (
              <li key={message.id} className="py-3">
                <p className="text-body font-medium">{message.name}</p>
                <p className="text-sm text-muted-foreground">{message.email}</p>
                <p className="text-body mt-1 line-clamp-2 text-muted-foreground">
                  {message.message}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
