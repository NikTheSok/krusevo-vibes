import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { useCookieConsent } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";

export function CookieConsent() {
  const { t } = useI18n();
  const { isPromptOpen, accept, decline } = useCookieConsent();

  if (!isPromptOpen) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("cookies.banner.title")}
      className="fixed inset-x-0 bottom-0 z-100 p-3 sm:p-5"
    >
      <Container size="wide" className="rounded-3xl border border-ink-border bg-ink/95 p-5 text-ink-foreground shadow-lift backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-lg font-bold">{t("cookies.banner.title")}</p>
            <p className="text-body mt-1 text-ink-muted">
              {t("cookies.banner.body")}{" "}
              <Link to="/cookies" className="font-semibold text-highlight underline-offset-4 hover:underline">
                {t("cookies.banner.link")}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={decline} className="border-ink-border bg-transparent text-ink-foreground hover:bg-ink-border/40">
              {t("cookies.banner.decline")}
            </Button>
            <Button variant="highlight" size="sm" onClick={accept}>
              {t("cookies.banner.accept")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
