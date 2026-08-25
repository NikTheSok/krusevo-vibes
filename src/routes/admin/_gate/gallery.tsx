import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/feedback/States";
import { adminGalleryQuery } from "@/lib/content/admin-queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — VIDIK admin" },
      { name: "description", content: "Festival images and their publication status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminGalleryPage,
});

function AdminGalleryPage() {
  const { t, pick } = useI18n();
  const { data: items } = useSuspenseQuery(adminGalleryQuery());

  return (
    <AdminShell title={t("admin.nav.gallery")}>
      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={item.image_url}
                alt={pick(item.alt_mk, item.alt_en) ?? ""}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-3 p-4">
                <p className="text-body truncate">{pick(item.title_mk, item.title_en) ?? "—"}</p>
                <StatusBadge published={item.is_published} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </AdminShell>
  );
}
