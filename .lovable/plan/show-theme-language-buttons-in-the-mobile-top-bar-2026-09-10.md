# Show theme + language buttons in the mobile top bar

## Problem
On phones (below 640px), the `ThemeToggle` and `LanguageToggle` are wrapped in a
`hidden … sm:flex` container in `Navbar.tsx`, so they do not appear in the top bar.
They only show up inside the hamburger menu drawer. Visitors on a phone can't switch
language or theme without opening the menu first.

## Current state (verified in `src/components/site/Navbar.tsx`)
- Top-bar control cluster:
  ```tsx
  <div className="hidden items-center gap-2 sm:flex">
    <ThemeToggle tone="ink" />
    <LanguageToggle tone="ink" />
  </div>
  ```
  `hidden` keeps these off-screen below the `sm` breakpoint (640px).
- The hamburger button and the "Tickets" button (`hidden sm:inline-flex`) are the only
  controls visible in the top bar on a phone.
- The mobile menu drawer already renders both toggles at the bottom — that stays.

## Plan
1. **Make the toggles always visible in the top bar.** Change the container class from
   `hidden items-center gap-2 sm:flex` to `flex items-center gap-2` so the theme and
   language controls render on every breakpoint, including phones.
2. **Keep the toggles in the mobile menu drawer** (already present) — no change there;
   the user wants both locations.
3. **Verify fit on a 375–384px viewport.** The row is logo (~70px, suffix hidden on
   mobile) + ThemeToggle (~90px) + LanguageToggle (~86px) + hamburger (44px) + gaps
   (~24px) ≈ 314px, which fits within 384px. If it looks cramped in the preview, tighten
   the gap to `gap-1` and/or shrink the toggle icons to `size-3` on mobile, promoting
   back to the current sizes at `sm:`.

## Files
- `src/components/site/Navbar.tsx` — one class change (step 1); optional gap tweak (step 3).

## No backend / data changes
