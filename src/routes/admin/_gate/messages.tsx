import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { adminMessagesQuery } from "@/lib/content/admin-queries";
import type { ContactMessage } from "@/lib/content/types";
import { formatDateTime } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/messages")({
  head: () => ({
    meta: [
      { title: "Messages — WhenInKrusevo admin" },
      { name: "description", content: "Contact messages received from the festival website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminMessagesPage,
});

function AdminMessagesPage() {
  const { t, locale } = useI18n();
  const { data: messages } = useSuspenseQuery(adminMessagesQuery());

  const columns: AdminColumn<ContactMessage>[] = [
    { key: "name", header: t("admin.table.name"), cell: (row) => row.name },
    { key: "email", header: t("admin.table.email"), cell: (row) => row.email },
    {
      key: "message",
      header: t("admin.table.message"),
      cell: (row) => <span className="line-clamp-2 max-w-md">{row.message}</span>,
    },
    {
      key: "date",
      header: t("admin.table.date"),
      cell: (row) => formatDateTime(row.created_at, locale),
    },
  ];

  return (
    <AdminShell title={t("admin.nav.messages")}>
      <AdminTable rows={messages} columns={columns} caption={t("admin.nav.messages")} />
    </AdminShell>
  );
}
