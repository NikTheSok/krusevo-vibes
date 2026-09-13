import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import type { OrderView } from "./orders.functions";
import type { TicketType } from "./types";

const ORDER_SELECT =
  "id, order_code, buyer_name, buyer_email, buyer_phone, status, total_mkd, currency, locale, notes, confirmation_email_sent_at, created_at, items:ticket_order_items(id, ticket_type_id, quantity, unit_price_mkd, ticket:ticket_types(name_mk, name_en))";

type RawOrder = {
  id: string;
  order_code: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  status: OrderView["status"];
  total_mkd: number | string;
  currency: string;
  locale: string;
  notes: string | null;
  confirmation_email_sent_at: string | null;
  created_at: string;
  items:
    | {
        id: string;
        ticket_type_id: string;
        quantity: number;
        unit_price_mkd: number | string;
        ticket: { name_mk: string; name_en: string } | null;
      }[]
    | null;
};

function toOrderView(order: RawOrder): OrderView {
  return {
    id: order.id,
    order_code: order.order_code,
    buyer_name: order.buyer_name,
    buyer_email: order.buyer_email,
    buyer_phone: order.buyer_phone,
    status: order.status,
    total_mkd: Number(order.total_mkd),
    currency: order.currency,
    locale: order.locale,
    notes: order.notes,
    confirmation_email_sent_at: order.confirmation_email_sent_at,
    created_at: order.created_at,
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      ticket_type_id: item.ticket_type_id,
      quantity: item.quantity,
      unit_price_mkd: Number(item.unit_price_mkd),
      name_mk: item.ticket?.name_mk ?? "",
      name_en: item.ticket?.name_en ?? "",
    })),
  };
}

/** All ticket orders. RLS only lets admins and editors read these rows. */
export const listAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OrderView[]> => {
    const { data, error } = await context.supabase
      .from("ticket_orders")
      .select(ORDER_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as RawOrder[]).map(toOrderView);
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: OrderView["status"]; notes?: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "cancelled", "checked_in"]),
        notes: z.string().trim().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<OrderView> => {
    const patch: { status: OrderView["status"]; notes?: string | null } = { status: data.status };
    if (data.notes !== undefined) patch.notes = data.notes || null;

    const { data: order, error } = await context.supabase
      .from("ticket_orders")
      .update(patch)
      .eq("id", data.id)
      .select(ORDER_SELECT)
      .single();
    if (error) throw new Error(error.message);
    return toOrderView(order as RawOrder);
  });

/** Re-sends the buyer's confirmation email for an existing order. */
export const resendOrderConfirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ sent: boolean; reason?: string }> => {
    const { data: order, error } = await context.supabase
      .from("ticket_orders")
      .select(ORDER_SELECT)
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const view = toOrderView(order as RawOrder);
    const locale = view.locale === "en" ? "en" : "mk";

    const { data: festival } = await context.supabase
      .from("festivals")
      .select("name, start_date, end_date, location_name")
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { sendOrderConfirmationEmail } = await import("@/lib/email/order-email.server");
    const result = await sendOrderConfirmationEmail({
      orderId: view.id,
      orderCode: view.order_code,
      buyerName: view.buyer_name,
      buyerEmail: view.buyer_email,
      locale,
      currency: view.currency,
      total: view.total_mkd,
      items: view.items.map((item) => ({
        name: locale === "mk" ? item.name_mk : item.name_en,
        quantity: item.quantity,
        unitPrice: item.unit_price_mkd,
      })),
      festivalName: festival?.name ?? "WhenInKrusevo",
      festivalDates: `${festival?.start_date ?? ""} – ${festival?.end_date ?? ""}`,
      festivalLocation: festival?.location_name ?? "Krusevo, North Macedonia",
    });

    if (result.sent) {
      await context.supabase
        .from("ticket_orders")
        .update({ confirmation_email_sent_at: new Date().toISOString() })
        .eq("id", view.id);
    }
    return result;
  });

const ticketPatch = z.object({
  id: z.string().uuid(),
  name_mk: z.string().trim().min(1).max(120),
  name_en: z.string().trim().min(1).max(120),
  description_mk: z.string().trim().max(600).optional().default(""),
  description_en: z.string().trim().max(600).optional().default(""),
  price_mkd: z.number().min(0).max(1000000),
  capacity: z.number().int().min(0).max(1000000).nullable(),
  perks_mk: z.array(z.string().trim().max(160)).max(12),
  perks_en: z.array(z.string().trim().max(160)).max(12),
  is_available: z.boolean(),
  is_published: z.boolean(),
  is_featured: z.boolean(),
});

export type TicketPatch = z.input<typeof ticketPatch>;

/** Lets staff edit pass details, price, capacity and availability. */
export const updateTicketType = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: TicketPatch) => ticketPatch.parse(input))
  .handler(async ({ data, context }): Promise<TicketType> => {
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("ticket_types")
      .update({
        ...patch,
        description_mk: patch.description_mk || null,
        description_en: patch.description_en || null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
