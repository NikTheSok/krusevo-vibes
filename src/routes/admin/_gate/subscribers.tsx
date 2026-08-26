import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { adminSubscribersQuery } from "@/lib/content/admin-queries";
import type { NewsletterSubscriber } from "@/lib/content/types";
import { formatDateTime } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/subscribers")({
  head: () => ({
    meta: [
      { title: "Subscribers — VIDIK admin" },
      { name: "description", content: "Newsletter subscribers of the festival." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSubscribersPage,
});

function AdminSubscribersPage() {
  const { t, locale } = useI18n();
  const { data: subscribers } = useSuspenseQuery(adminSubscribersQuery());

  const columns: AdminColumn<NewsletterSubscriber>[] = [
    { key: "email", header: t("admin.table.email"), cell: (row) => row.email },
    { key: "locale", header: t("admin.table.category"), cell: (row) => row.locale.toUpperCase() },
    {
      key: "date",
      header: t("admin.table.date"),
      cell: (row) => formatDateTime(row.created_at, locale),
    },
  ];

  return (
    <AdminShell title={t("admin.nav.subscribers")}>
      <AdminTable rows={subscribers} columns={columns} caption={t("admin.nav.subscribers")} />
    </AdminShell>
  );
}
