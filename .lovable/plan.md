# Rename activity and make activities editable in admin

## 1. Rename the activity
- Change the activity "Работилница за ткаење" to **"Традиционална музика"** (Macedonian) and **"Traditional music"** (English).
- Update its description in both languages so it matches the new name (I'll write it; you can adjust it later in admin).
- Add the same change to the self-hosted sync file so your own copy stays in step.

## 2. Edit activities in admin (/admin/activities)
- Each row gets an **Edit** button that opens a form, the same way passes are edited on /admin/tickets.
- Fields you can change:
  - Name (MK / EN)
  - Description (MK / EN)
  - **Price** in MKD (0 = free, the card shows "Reserve")
  - **Duration** in hours and minutes
  - Spots, difficulty, category
  - Published / featured switches
- Saving updates the public Activities page right away.

## Technical details
- New `updateActivity` server function in `orders-admin.functions.ts`-style admin module, `requireSupabaseAuth` + Zod validation; RLS (`is_admin()`) already allows staff updates.
- Dialog in `src/routes/admin/_gate/activities.tsx`; invalidate admin activities + public activities queries.
- Data rename via a data update on the matching `activities` row (looked up by its title), plus an UPDATE appended to `20261017211300_sync_live_content.sql`.
- New MK/EN translation keys for the form labels.

## Question
"Time" is read as the activity's **duration**. If you meant a specific start date/time for each activity, tell me and I'll add that field too.
