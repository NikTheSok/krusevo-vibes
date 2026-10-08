# Krusevo Peaks Festival

Build a production-ready modern festival and tourism web application inspired by the structure and energy of https://wheninkrusevo.mk/, but DO NOT copy its branding, text, images, visual identity, or source code.

The website will be for a fictional outdoor cultural and music festival in Krusevo, North Macedonia.

PROJECT GOAL

Create a premium, modern, highly visual festival website that combines:

- outdoor adventure

- music

- culture

- tourism

- local experiences

- events

- activities

- ticketing

- reservations

- multilingual content

- administration/CMS

The final product must feel like a professional international festival website, not a generic template.

IMPORTANT DEVELOPMENT RULES

1. Build reusable components.

2. Keep the code modular and maintainable.

3. Do not duplicate components unnecessarily.

4. Use semantic HTML.

5. Make the entire application responsive.

6. Design mobile-first.

7. Use accessible UI patterns.

8. Do not hardcode content directly into components when that content should eventually be managed through the CMS/database.

9. Separate UI components from data/content logic.

10. Prepare the architecture for future authentication, payments, analytics and third-party integrations.

11. Do not expose secrets or API keys in frontend code.

12. Use environment variables for secrets.

13. Add proper loading, empty, success and error states.

14. Do not use placeholder lorem ipsum.

15. Use realistic sample festival content.

16. Do not implement fake functionality that only looks functional. If a feature requires backend/database support, create the proper structure for it.

TECH STACK

Use a modern production-ready stack supported by Lovable.

Preferred:

- React

- TypeScript

- Tailwind CSS

- reusable component architecture

- modern routing

- Supabase for database/auth/storage where backend functionality is required

Use a clean and scalable folder/component structure.

DESIGN DIRECTION

The visual direction should be:

Modern Alpine / Outdoor / Cultural Festival.

Design characteristics:

- premium

- editorial

- bold

- cinematic

- minimal but expressive

- strong typography

- large photography

- dark and light sections

- subtle gradients

- rounded cards

- modern buttons

- generous spacing

- subtle motion

- smooth transitions

- high-quality mobile experience

Avoid:

- generic SaaS appearance

- corporate dashboard aesthetics on the public website

- excessive gradients

- excessive glassmorphism

- cheap-looking animations

- excessive shadows

- cluttered layouts

COLOR SYSTEM

Create a centralized design system.

Primary direction:

- deep forest / charcoal dark background

- warm off-white

- natural green accent

- optional warm orange/yellow accent for highlights

Do not hardcode colors throughout individual components.

Create reusable design tokens so colors can easily be changed later.

TYPOGRAPHY

Use a modern editorial typography system.

Use:

- large display typography for hero sections

- strong section headings

- highly readable body text

- clear hierarchy

Create reusable typography classes/components.

PUBLIC WEBSITE STRUCTURE

Create the following initial routes:

/

 /program

 /activities

 /artists

 /about

 /gallery

 /locations

 /contact

 /tickets

 /faq

 /privacy

 /cookies

 /terms

Also prepare the application for:

/admin

/admin/dashboard

/admin/program

/admin/activities

/admin/artists

/admin/gallery

/admin/locations

/admin/tickets

/admin/settings

The admin routes can initially be protected by authentication and should not be publicly accessible.

NAVIGATION

Create a responsive navigation system.

Desktop:

- festival logo

- Home

- Program

- Activities

- Artists

- About

- Gallery

- Locations

- Contact

- Tickets CTA

- language switcher

Mobile:

- hamburger menu

- animated mobile navigation drawer

- same navigation items

- language switcher

- prominent Tickets CTA

The navbar should become sticky after scrolling.

Create an appropriate active navigation state.

FOOTER

Create a professional footer containing:

- festival logo/name

- short festival description

- navigation

- social links

- contact information

- newsletter signup

- privacy policy

- cookie policy

- terms

- copyright

- language switcher

Create placeholders for:

- Instagram

- Facebook

- YouTube

- TikTok

Do not use fake external URLs. Use clearly marked configuration placeholders.

HOMEPAGE STRUCTURE

Create the initial homepage structure with these sections:

1. Full-screen hero

2. Festival introduction

3. Key festival statistics

4. Featured program

5. Featured activities

6. Featured artists

7. Krusevo / destination section

8. Gallery preview

9. Sponsors / partners

10. Newsletter CTA

11. Contact CTA

12. Footer

The homepage should be visually rich and highly scrollable.

HERO

Create a cinematic hero section.

Include:

- large background image/video-ready container

- dark overlay

- festival name

- festival dates

- location

- short tagline

- primary CTA: "Get Tickets"

- secondary CTA: "Explore Program"

- countdown component

The hero must work beautifully on mobile.

Use a configurable background image URL rather than hardcoding the image into the component.

COUNTDOWN

Create a reusable countdown component.

It should accept:

- target date

- timezone

Display:

- days

- hours

- minutes

- seconds

Handle:

- active countdown

- event started state

- event finished state

Do not create fake ticking values.

STATS

Create reusable statistic cards.

Example:

- 3 Days

- 20+ Activities

- 10+ Artists

- 1 Mountain

Make these values configurable.

COMPONENT SYSTEM

Create reusable components such as:

- Button

- Container

- Section

- SectionHeading

- Navbar

- Footer

- Hero

- Countdown

- StatCard

- EventCard

- ActivityCard

- ArtistCard

- LocationCard

- GalleryCard

- TicketCard

- FAQItem

- NewsletterForm

- ContactForm

- Modal

- Drawer

- Tabs

- Badge

- Breadcrumbs

- LoadingState

- EmptyState

- ErrorState

Keep these components reusable across the entire application.

DATA MODEL PREPARATION

Prepare the application around these entities:

Festival

Event

Activity

Artist

Location

GalleryItem

Sponsor

TicketType

FAQ

Page

SiteSetting

NewsletterSubscriber

ContactMessage

Do not create unnecessary fields yet, but structure the application so these entities can later be stored in Supabase.

MULTILINGUAL PREPARATION

The application MUST be architected for two languages:

Macedonian

English

Do not simply duplicate pages.

Create a centralized localization architecture.

All user-facing strings should eventually be translatable.

Use language keys rather than scattering hardcoded UI strings throughout components.

The default language should be Macedonian.

Create a language switcher in the navbar.

Persist the selected language.

DATABASE

Connect/configure Supabase architecture where appropriate.

Prepare database schemas for the entities above.

Use appropriate relationships.

Use timestamps.

Use UUID primary keys where appropriate.

Prepare Row Level Security policies.

Public users should only be able to read published public content.

Admin users should be able to manage content.

Do not expose sensitive admin data publicly.

AUTHENTICATION

Prepare admin authentication using Supabase Auth.

Admin users must be authenticated before accessing /admin.

Unauthenticated users visiting /admin should be redirected to a login page.

Create:

 /admin/login

Do not implement public user accounts yet.

ADMIN FOUNDATION

Create an initial admin dashboard UI.

It should include:

- overview statistics

- recent contact messages

- newsletter subscribers count

- upcoming events

- quick actions

Create sidebar navigation for:

Dashboard

Program

Activities

Artists

Gallery

Locations

Tickets

Messages

Subscribers

Settings

The admin UI should be visually separate from the public festival website while still using the same design system.

SEO FOUNDATION

Prepare:

- dynamic page titles

- meta descriptions

- Open Graph metadata

- canonical URLs

- sitemap-ready structure

- robots.txt

- semantic headings

- proper image alt attributes

Do not use the same metadata for every page.

ACCESSIBILITY

Follow WCAG-oriented practices.

Implement:

- keyboard navigation

- visible focus states

- semantic HTML

- accessible buttons

- accessible forms

- appropriate ARIA only when needed

- sufficient contrast

- reduced motion support

RESPONSIVENESS

Test and optimize for:

- 320px

- 375px

- 390px

- 414px

- 768px

- 1024px

- 1280px

- 1440px

- 1920px

Do not simply shrink desktop layouts.

Create intentionally designed mobile layouts.

ANIMATION

Use subtle premium animations.

Examples:

- fade/slide on scroll

- image reveal

- card hover

- button transitions

- mobile menu animation

- smooth section transitions

Respect prefers-reduced-motion.

Do not over-animate the site.

PERFORMANCE

Prepare for production performance:

- lazy load images

- avoid unnecessary JavaScript

- optimize component rendering

- avoid huge DOM structures

- use responsive image techniques

- avoid autoplay video on mobile unless explicitly configured

- avoid layout shifts

ERROR HANDLING

Create:

- 404 page

- generic error state

- loading states

- empty states

- form validation messages

- success states

CONTENT

Use realistic fictional content related to:

- Krusevo

- mountain/outdoor experiences

- music

- culture

- food

- local tourism

Do not copy text from wheninkrusevo.mk.

FINAL REQUIREMENT

Before considering this phase complete:

1. Make sure the public homepage is polished.

2. Make sure routing works.

3. Make sure the responsive navigation works.

4. Make sure the admin foundation exists.

5. Make sure the multilingual architecture is prepared.

6. Make sure Supabase architecture is prepared.

7. Make sure components are reusable.

8. Make sure there are no broken links.

9. Make sure there are no obvious console errors.

10. Make sure the design looks premium on both desktop and mobile.

Do not add unnecessary features beyond this scope yet.

Build this as a strong foundation for the next development phases.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/63c445d6-dfdb-4c8e-b58b-a386bdf2425b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
