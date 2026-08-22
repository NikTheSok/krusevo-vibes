import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { NewsletterForm } from "./NewsletterForm";
import { Container } from "@/components/layout/Container";
import { siteSettingsQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";
import { INFO_NAV, MAIN_NAV, SOCIAL_CHANNELS } from "@/lib/nav";

const SOCIAL_LABEL: Record<(typeof SOCIAL_CHANNELS)[number], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function Footer() {
  const { t } = useI18n();
  const { data: settings } = useQuery(siteSettingsQuery());

  return (
    <footer className="surface-ink">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-bold">{t("brand.name")}</p>
            <p className="text-eyebrow mt-2 text-highlight">{t("brand.location")}</p>
            <p className="text-body mt-5 max-w-sm text-ink-muted">{t("footer.about")}</p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h2 className="text-eyebrow text-ink-muted">{t("footer.explore")}</h2>
            <ul className="mt-5 space-y-3">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-body text-ink-foreground/90 hover:text-highlight">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.info")}>
            <h2 className="text-eyebrow text-ink-muted">{t("footer.info")}</h2>
            <ul className="mt-5 space-y-3">
              {INFO_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-body text-ink-foreground/90 hover:text-highlight">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow text-ink-muted">{t("footer.contact")}</h2>
            <ul className="mt-5 space-y-3 text-body text-ink-foreground/90">
              {settings?.contact.email ? (
                <li>
                  <a className="hover:text-highlight" href={`mailto:${settings.contact.email}`}>
                    {settings.contact.email}
                  </a>
                </li>
              ) : null}
              {settings?.contact.phone ? (
                <li>
                  <a className="hover:text-highlight" href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}>
                    {settings.contact.phone}
                  </a>
                </li>
              ) : null}
              {settings?.contact.address ? <li>{settings.contact.address}</li> : null}
            </ul>

            <h2 className="text-eyebrow mt-8 text-ink-muted">{t("footer.follow")}</h2>
            <ul className="mt-5 space-y-3 text-body">
              {SOCIAL_CHANNELS.map((channel) => {
                const url = settings?.social[channel];
                return (
                  <li key={channel}>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink-foreground/90 hover:text-highlight"
                      >
                        {SOCIAL_LABEL[channel]}
                      </a>
                    ) : (
                      <span className="text-ink-muted">
                        {SOCIAL_LABEL[channel]} · {t("footer.social.unconfigured")}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-border pt-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t("brand.name")} {t("brand.suffix")}. {t("footer.rights")}
          </p>
          <Link to="/admin/login" className="hover:text-highlight">
            {t("admin.login.title")}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
