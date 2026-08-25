import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ErrorState } from "@/components/feedback/States";
import { LoadingState } from "@/components/feedback/States";
import { supabase } from "@/integrations/supabase/client";
import { adminAccessQuery } from "@/lib/content/admin-queries";
import { useI18n } from "@/lib/i18n";

/**
 * Client-only gate for the whole /admin area: the Supabase session lives in
 * browser storage, so SSR cannot see it. Unauthenticated visitors go to
 * /admin/login; signed-in users without a staff role see a no-access notice.
 */
export const Route = createFileRoute("/admin/_gate")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    return { user: data.user };
  },
  pendingComponent: () => <LoadingState className="min-h-screen" />,
  errorComponent: () => <ErrorState className="m-8" />,
  component: AdminGate,
});

function AdminGate() {
  const { t } = useI18n();
  const { data: access } = useSuspenseQuery(adminAccessQuery());

  if (!access.isAdmin) {
    return (
      <AdminShell title={t("admin.noAccess.title")} description={t("admin.noAccess.body")}>
        <span className="sr-only">{t("admin.noAccess.body")}</span>
      </AdminShell>
    );
  }

  return <Outlet />;
}
