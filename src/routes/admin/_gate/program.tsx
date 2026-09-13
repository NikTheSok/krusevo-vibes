import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminEventsQuery } from "@/lib/content/admin-queries";
import type { AdminEventRow } from "@/lib/content/admin.functions";
import { formatDateTime } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/program")({
  head: () => ({
    meta: [
      { title: "Programme — WhenInKrusevo admin" },
      { name: "description", content: "All festival events and their publication status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProgramPage,
});

function AdminProgramPage() {
  const { t, locale, pick } = useI18n();
  const { data: events } = useSuspenseQuery(adminEventsQuery());

  const columns: AdminColumn<AdminEventRow>[] = [
    { key: "title", header: t("admin.table.title"), cell: (row) => pick(row.title_mk, row.title_en) },
    { key: "category", header: t("admin.table.category"), cell: (row) => row.category ?? "—" },
    { key: "date", header: t("admin.table.date"), cell: (row) => formatDateTime(row.starts_at, locale) },
    {
      key: "status",
      header: t("admin.table.status"),
      cell: (row) => <StatusBadge published={row.is_published} />,
    },
  ];

  return (
    <AdminShell title={t("admin.nav.program")}>
      <AdminTable rows={events} columns={columns} caption={t("admin.nav.program")} />
    </AdminShell>
  );
}
