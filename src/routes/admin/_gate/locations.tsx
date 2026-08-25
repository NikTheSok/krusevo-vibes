import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminLocationsQuery } from "@/lib/content/admin-queries";
import type { FestivalLocation } from "@/lib/content/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/locations")({
  head: () => ({
    meta: [
      { title: "Locations — VIDIK admin" },
      { name: "description", content: "Festival stages and venues." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLocationsPage,
});

function AdminLocationsPage() {
  const { t } = useI18n();
  const { data: locations } = useSuspenseQuery(adminLocationsQuery());

  const columns: AdminColumn<FestivalLocation>[] = [
    { key: "name", header: t("admin.table.name"), cell: (row) => row.name },
    { key: "address", header: t("locations.title"), cell: (row) => row.address ?? "—" },
    {
      key: "coords",
      header: t("locations.map"),
      cell: (row) =>
        row.latitude !== null && row.longitude !== null ? `${row.latitude}, ${row.longitude}` : "—",
    },
    {
      key: "status",
      header: t("admin.table.status"),
      cell: (row) => <StatusBadge published={row.is_published} />,
    },
  ];

  return (
    <AdminShell title={t("admin.nav.locations")}>
      <AdminTable rows={locations} columns={columns} caption={t("admin.nav.locations")} />
    </AdminShell>
  );
}
