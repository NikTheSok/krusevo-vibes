import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminArtistsQuery } from "@/lib/content/admin-queries";
import type { Artist } from "@/lib/content/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/artists")({
  head: () => ({
    meta: [
      { title: "Artists — WhenInKrusevo admin" },
      { name: "description", content: "The festival line-up and stage assignments." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminArtistsPage,
});

function AdminArtistsPage() {
  const { t } = useI18n();
  const { data: artists } = useSuspenseQuery(adminArtistsQuery());

  const columns: AdminColumn<Artist>[] = [
    { key: "name", header: t("admin.table.name"), cell: (row) => row.name },
    { key: "genre", header: t("admin.table.category"), cell: (row) => row.genre ?? "—" },
    { key: "stage", header: t("nav.locations"), cell: (row) => row.stage ?? "—" },
    {
      key: "status",
      header: t("admin.table.status"),
      cell: (row) => <StatusBadge published={row.is_published} />,
    },
  ];

  return (
    <AdminShell title={t("admin.nav.artists")}>
      <AdminTable rows={artists} columns={columns} caption={t("admin.nav.artists")} />
    </AdminShell>
  );
}
