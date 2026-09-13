import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Unguessable, human-readable order code, e.g. WIK-7F3K9Q4M. */
export function generateOrderCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
  return `WIK-${body}`;
}

/** Tickets already committed per pass (pending, confirmed and checked-in orders). */
export async function soldPerTicketType(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin
    .from("ticket_order_items")
    .select("ticket_type_id, quantity, order:ticket_orders!inner(status)")
    .in("order.status", ["pending", "confirmed", "checked_in"]);
  if (error) throw new Error(error.message);

  const sold: Record<string, number> = {};
  for (const row of data ?? []) {
    sold[row.ticket_type_id] = (sold[row.ticket_type_id] ?? 0) + row.quantity;
  }
  return sold;
}
