# WhenInKrusevo Festival 2027

Official website for **WhenInKrusevo Festival**, a three-day open-air festival in Krusevo, North Macedonia (15–17 July 2027). The festival combines live music, mountain adventures, local food and living traditions in the highest town in the Balkans, at 1350 metres above sea level.

## Live site

- **Published (Lovable):** https://krusevo-vibes.lovable.app/

## About the project

The site is the festival's home on the web. Visitors can browse the program, see who is performing, discover outdoor and cultural activities, explore the locations around town, and buy tickets. Organisers get an admin panel to manage orders, messages and subscribers. The whole site is available in Macedonian and English.

## Features

- **Bilingual interface**: switch between Macedonian (MK) and English (EN)
- **Light, dark and system themes**
- **Festival program** with events, times, stages and performers
- **Artists** pages with genre, stage, bio and photo
- **Activities** (hiking, paragliding, workshops and more) with duration, difficulty, capacity and price
- **Locations**, **gallery** and **FAQ** pages
- **Ticket selection and checkout** with multiple ticket tiers and an order confirmation page that can be opened with an order code
- **Countdown** to the festival start
- **Newsletter signup** and **contact form**
- **Admin panel** with login, dashboard, orders, messages, subscribers and settings
- **Privacy, cookies and terms** pages with cookie preferences
- Server-side rendering for fast loading and good SEO

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React, SSR) with TanStack Router |
| Language | TypeScript |
| Build tool | Vite, Nitro |
| UI | React, Tailwind CSS, Radix UI components (shadcn/ui style), Lucide icons, Sonner toasts |
| Data fetching | TanStack Query, Zod validation |
| Backend and database | [Supabase](https://supabase.com) (PostgreSQL, REST API, Auth) |
| Package manager and runtime | Bun |
| Containers and hosting | Docker, Docker Compose, Reporun |

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Set environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your publishable (anon) key>
SUPABASE_PROJECT_ID=<your-project-id>
SUPABASE_SERVICE_ROLE_KEY=<your service role key>

VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable (anon) key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>
```

> The URL is the plain project URL, **without** `/rest/v1/` at the end.
> `SUPABASE_SERVICE_ROLE_KEY` is a secret. Never commit it, never share it, and only use it on the server.

### 3. Set up the database

In the Supabase **SQL Editor**, run the files from `supabase/migrations/` in order (oldest first). They create the tables and the starting data.

Then run `supabase/content/20261017211300_sync_live_content.sql` once. It applies the content changes (artists, program events and festival settings) that were made in the live Lovable database after the original migrations.

### 4. Run the development server

```bash
bun run dev
```

The site opens at the address printed in the terminal.

### Run with Docker

```bash
docker compose up --build
```

The app listens on port 3000 inside the container. Docker Compose reads the variables above from your `.env` file (or from the environment values of your hosting platform).


## Team

- [NikTheSok](https://github.com/NikTheSok)
- [KoteskiG](https://github.com/KoteskiG)
