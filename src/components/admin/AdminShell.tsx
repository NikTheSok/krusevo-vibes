import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { ADMIN_NAV } from "@/lib/nav";

/** Chrome for every /admin page: sidebar navigation, page title and sign-out. */
export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-muted/40 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="surface-ink flex flex-col gap-8 px-5 py-6 lg:min-h-screen">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          {t("brand.name")}
        </Link>
        <nav aria-label={t("admin.dashboard.title")} className="flex flex-wrap gap-1 lg:flex-col">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-white/10 hover:text-white"
              activeProps={{ className: "bg-white/15 text-white" }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-6">
          <Button asChild variant="onInk" size="sm">
            <Link to="/">{t("admin.viewSite")}</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-ink-muted" onClick={signOut}>
            {t("admin.logout")}
          </Button>
        </div>
      </aside>

      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-title text-2xl sm:text-3xl">{title}</h1>
            {description ? (
              <p className="text-body mt-2 max-w-2xl text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </header>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
