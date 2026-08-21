import type { TranslationKey } from "@/lib/i18n";

export type NavItem = {
  to:
    | "/"
    | "/program"
    | "/activities"
    | "/artists"
    | "/about"
    | "/gallery"
    | "/locations"
    | "/contact"
    | "/tickets"
    | "/faq"
    | "/privacy"
    | "/cookies"
    | "/terms";
  labelKey: TranslationKey;
};

/** Primary navigation, shared by the navbar, mobile drawer and footer. */
export const MAIN_NAV: NavItem[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/program", labelKey: "nav.program" },
  { to: "/activities", labelKey: "nav.activities" },
  { to: "/artists", labelKey: "nav.artists" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/gallery", labelKey: "nav.gallery" },
  { to: "/locations", labelKey: "nav.locations" },
  { to: "/contact", labelKey: "nav.contact" },
];

export const INFO_NAV: NavItem[] = [
  { to: "/tickets", labelKey: "nav.tickets" },
  { to: "/faq", labelKey: "nav.faq" },
  { to: "/privacy", labelKey: "footer.privacy" },
  { to: "/cookies", labelKey: "footer.cookies" },
  { to: "/terms", labelKey: "footer.terms" },
];

export type AdminNavItem = {
  to:
    | "/admin/dashboard"
    | "/admin/program"
    | "/admin/activities"
    | "/admin/artists"
    | "/admin/gallery"
    | "/admin/locations"
    | "/admin/tickets"
    | "/admin/messages"
    | "/admin/subscribers"
    | "/admin/settings";
  labelKey: TranslationKey;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { to: "/admin/dashboard", labelKey: "admin.nav.dashboard" },
  { to: "/admin/program", labelKey: "admin.nav.program" },
  { to: "/admin/activities", labelKey: "admin.nav.activities" },
  { to: "/admin/artists", labelKey: "admin.nav.artists" },
  { to: "/admin/gallery", labelKey: "admin.nav.gallery" },
  { to: "/admin/locations", labelKey: "admin.nav.locations" },
  { to: "/admin/tickets", labelKey: "admin.nav.tickets" },
  { to: "/admin/messages", labelKey: "admin.nav.messages" },
  { to: "/admin/subscribers", labelKey: "admin.nav.subscribers" },
  { to: "/admin/settings", labelKey: "admin.nav.settings" },
];

/** Social channels: URLs are configuration, stored in site settings. */
export const SOCIAL_CHANNELS = ["instagram", "facebook", "youtube", "tiktok"] as const;
export type SocialChannel = (typeof SOCIAL_CHANNELS)[number];
