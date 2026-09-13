import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team sign in — WhenInKrusevo Festival" },
      { name: "description", content: "Sign in to the WhenInKrusevo Festival content administration." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    });
    setPending(false);
    if (signInError) {
      setError(t("admin.login.error"));
      return;
    }
    await navigate({ to: "/admin/dashboard" });
  }

  return (
    <div className="surface-ink flex min-h-screen items-center">
      <Container size="narrow">
        <div className="mx-auto max-w-md rounded-3xl bg-background p-8 text-foreground shadow-xl">
          <h1 className="text-title text-2xl">{t("admin.login.title")}</h1>
          <p className="text-body mt-2 text-muted-foreground">{t("admin.login.subtitle")}</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">{t("admin.login.email")}</Label>
              <Input id="admin-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">{t("admin.login.password")}</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? t("form.sending") : t("admin.login.submit")}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
