# WhenInKrusevo: rename + working ticket sales

## 1. Rename the festival

Replace "VIDIK" with "WhenInKrusevo" everywhere it appears: the logo/wordmark, all page titles and share descriptions, and the Macedonian and English body text on the home, about, tickets, program and legal pages. The festival record in the database is renamed too, so admin views and content match.

## 2. Ticket checkout (no real payment)

New public flow at `/tickets`:

- Each pass has a "Buy" button that opens a checkout page.
- Checkout asks for name, email, phone (optional) and quantity per pass — no account needed.
- On submit, the order is saved, capacity is checked, an order code is generated (e.g. `WIK-7F3K9Q`), and the buyer lands on a confirmation page showing the code, passes, quantity and total.
- Free-of-charge for now: instead of a card step, the order is marked "reserved/confirmed" immediately. The place where a real payment provider would slot in is kept as a single clear step so it can be swapped later without redesigning the flow.
- Proper loading, validation, sold-out and error states; bilingual throughout.
- Sold-out and remaining-capacity logic is real: if a pass has a capacity, remaining count comes from confirmed orders.

## 3. Confirmation email

A ticket confirmation email is sent to the buyer right after ordering: order code, buyer name, pass names, quantities, total, festival dates and location, plus a note that entry is by order code.

This needs your own sending domain set up first (DNS records at your registrar). I'll open the email setup dialog for you as the first step — until it's verified, orders still work and the email send is skipped safely rather than breaking checkout.

## 4. Admin ticket management

Admin account created for nikola.sokoloski@gmail.com with a temporary password you change after first sign-in (sign in at `/admin/login`).

New `/admin/orders` area for managing purchases:

- List of all orders: code, buyer, email, passes, quantity, total, status, date; searchable and filterable by status.
- Order detail view with the ability to mark an order confirmed, cancelled or checked-in (used at the gate), and resend the confirmation email.
- Existing `/admin/tickets` view gains editable pass fields (name, description, price, perks, capacity, availability, published) so pass inventory is managed from the admin, not in code.
- Dashboard gains ticket-sales figures: orders, tickets sold, revenue, remaining capacity.

## Technical notes

- New tables: `ticket_orders` (order code, buyer name/email/phone, status, total, currency, locale, timestamps) and `ticket_order_items` (order, ticket type, quantity, unit price snapshot). RLS: no public reads; inserts happen only through a server function using the service role after validation; admin/editor roles can read and update via `is_admin()`. GRANTs included per table.
- Order creation is a validated `createServerFn` (Zod): re-prices from the database rather than trusting client prices, verifies availability/capacity, inserts order + items atomically, then sends the email with an idempotency key derived from the order id.
- Confirmation lookup by order code goes through a dedicated server function; the code is a random unguessable string, and it returns only that order's own data.
- Email uses Lovable's managed sending with a React Email template in `src/lib/email-templates/`.
- Admin mutations (order status, ticket-type edits) are `requireSupabaseAuth` server functions that verify the admin/editor role before writing.
- Admin account is created via the auth admin API plus an `admin` row in `user_roles`.
