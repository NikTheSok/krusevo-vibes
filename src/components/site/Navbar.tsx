import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { useI18n } from "@/lib/i18n";
import { MAIN_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80" : "bg-transparent",
      )}
    >
      <Container size="wide" as="nav" aria-label={t("nav.menu")}>
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          <Link to="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-display text-2xl font-bold tracking-tight text-ink-foreground">
              {t("brand.name")}
            </span>
            <span className="hidden text-eyebrow text-highlight sm:inline">{t("brand.suffix")}</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-highlight" }}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageToggle tone="ink" />
            </div>
            <Button asChild variant="highlight" size="sm" className="hidden sm:inline-flex">
              <Link to="/tickets">{t("cta.tickets")}</Link>
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink-border text-ink-foreground lg:hidden"
              aria-expanded={open}
              aria-label={open ? t("nav.close") : t("nav.open")}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-ink-border bg-ink lg:hidden">
          <Container size="wide" className="py-6">
            <ul className="flex flex-col gap-1">
              {[...MAIN_NAV, { to: "/tickets" as const, labelKey: "nav.tickets" as const }, { to: "/faq" as const, labelKey: "nav.faq" as const }].map(
                (item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: item.to === "/" }}
                      activeProps={{ className: "text-highlight" }}
                      className="block rounded-xl px-3 py-3 text-lg font-semibold text-ink-foreground"
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ),
              )}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <LanguageToggle tone="ink" />
              <Button asChild variant="highlight" size="sm">
                <Link to="/tickets" onClick={() => setOpen(false)}>
                  {t("cta.tickets")}
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
