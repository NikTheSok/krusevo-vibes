# Dark / light theme + cookie consent

## What exists today
- The design system already defines both a light palette and a full dark palette in the stylesheet, but nothing ever switches between them — the site is always light (dark sections aside).
- A Cookies policy page already exists at /cookies and is linked in the footer. There is no cookie consent banner yet, and no place where a visitor can accept or decline.

## 1. Theme option (light / dark / system)

- Add a small theme provider that remembers the visitor's choice, mirroring how the language choice is stored today.
- Default: follow the device setting. Visitors can pick Light or Dark explicitly.
- Add a sun/moon toggle button in the top bar next to the language switch, and in the mobile menu. Accessible label, keyboard usable.
- Apply the choice before the page paints so there is no white flash on load for dark-mode visitors.
- Review key surfaces in dark mode (cards, hero overlays, footer, ticket and artist cards, admin tables) and correct any spot that reads poorly.
- Both new labels ("Theme", "Light", "Dark", "System") get Macedonian and English entries in the translation file.

## 2. Cookie consent banner

- A bottom banner shown on first visit: short explanation, "Accept", "Decline", and a link to the existing Cookies page.
- The choice is stored on the device for a year; the banner never reappears once answered.
- Analytics or other non-essential scripts stay off unless consent is given — nothing non-essential runs before the visitor answers.
- A "Cookie settings" link in the footer reopens the banner so the choice can be changed.
- All banner text is bilingual, added to the translation file.

## Technical notes

- New `ThemeProvider` in `src/lib/theme/` using a `vidik.theme` localStorage key and the `dark` class on `<html>`; a tiny inline script in the root route head applies the stored class pre-hydration.
- `ThemeToggle` component in `src/components/site/`, placed in `Navbar` (desktop and mobile) alongside `LanguageToggle`.
- `CookieConsent` component in `src/components/site/`, rendered once in the root route below the footer; consent stored as a `vidik.cookie-consent` cookie plus a small `useCookieConsent` hook exposing the status for future analytics wiring.
- No database or backend changes.
