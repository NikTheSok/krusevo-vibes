import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/feedback/States";
import { adminSettingsQuery } from "@/lib/content/admin-queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VIDIK admin" },
      { name: "description", content: "Site settings used across the festival website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { t } = useI18n();
  const { data: settings } = useSuspenseQuery(adminSettingsQuery());

  return (
    <AdminShell title={t("admin.nav.settings")} description={t("admin.settings.body")}>
      {settings.length ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {settings.map((setting) => (
            <li key={setting.key} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-eyebrow text-muted-foreground">{setting.key}</p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-relaxed">
                {setting.value}
              </pre>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </AdminShell>
  );
}
