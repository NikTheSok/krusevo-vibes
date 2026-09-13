import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminActivitiesQuery } from "@/lib/content/admin-queries";
import type { Activity } from "@/lib/content/types";
import { formatDuration, formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/activities")({
  head: () => ({
    meta: [
      { title: "Activities — WhenInKrusevo admin" },
      { name: "description", content: "All festival activities and experiences." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminActivitiesPage,
});

function AdminActivitiesPage() {
  const { t, locale, pick } = useI18n();
  const { data: activities } = useSuspenseQuery(adminActivitiesQuery());

  const columns: AdminColumn<Activity>[] = [
    { key: "title", header: t("admin.table.title"), cell: (row) => pick(row.title_mk, row.title_en) },
    { key: "category", header: t("admin.table.category"), cell: (row) => row.category ?? "—" },
    {
      key: "duration",
      header: t("activities.duration"),
      cell: (row) => formatDuration(row.duration_minutes, locale),
    },
    {
      key: "price",
      header: t("admin.table.price"),
      cell: (row) => formatPrice(row.price_mkd, locale),
    },
    {
      key: "status",
      header: t("admin.table.status"),
      cell: (row) => <StatusBadge published={row.is_published} />,
    },
  ];

  return (
    <AdminShell title={t("admin.nav.activities")}>
      <AdminTable rows={activities} columns={columns} caption={t("admin.nav.activities")} />
    </AdminShell>
  );
}
