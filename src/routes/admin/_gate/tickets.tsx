import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminTicketsQuery } from "@/lib/content/admin-queries";
import type { TicketType } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets — VIDIK admin" },
      { name: "description", content: "Ticket types, prices and availability." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminTicketsPage,
});

function AdminTicketsPage() {
  const { t, locale, pick } = useI18n();
  const { data: tickets } = useSuspenseQuery(adminTicketsQuery());

  const columns: AdminColumn<TicketType>[] = [
    { key: "name", header: t("admin.table.name"), cell: (row) => pick(row.name_mk, row.name_en) },
    {
      key: "price",
      header: t("admin.table.price"),
      cell: (row) => formatPrice(row.price_mkd, locale, row.currency),
    },
    {
      key: "capacity",
      header: t("tickets.capacity"),
      cell: (row) => row.capacity ?? "—",
    },
    {
      key: "availability",
      header: t("admin.table.status"),
      cell: (row) =>
        row.is_available ? <StatusBadge published={row.is_published} /> : t("tickets.soldout"),
    },
  ];

  return (
    <AdminShell title={t("admin.nav.tickets")}>
      <AdminTable rows={tickets} columns={columns} caption={t("admin.nav.tickets")} />
    </AdminShell>
  );
}
