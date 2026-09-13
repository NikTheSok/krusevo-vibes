import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type TicketAvailability = {
  ticket_type_id: string;
  sold: number;
  /** null when the pass has no capacity limit. */
  remaining: number | null;
};

export type OrderItemView = {
  id: string;
  ticket_type_id: string;
  quantity: number;
  unit_price_mkd: number;
  name_mk: string;
  name_en: string;
};

export type OrderView = {
  id: string;
  order_code: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  status: "pending" | "confirmed" | "cancelled" | "checked_in";
  total_mkd: number;
  currency: string;
  locale: string;
  notes: string | null;
  confirmation_email_sent_at: string | null;
  created_at: string;
  items: OrderItemView[];
};

const orderInput = z.object({
  buyer_name: z.string().trim().min(2).max(120),
  buyer_email: z.string().trim().min(3).max(320).email(),
  buyer_phone: z.string().trim().max(40).optional().default(""),
  locale: z.enum(["mk", "en"]),
  items: z
    .array(
      z.object({
        ticket_type_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(6),
});

export type CreateOrderInput = z.input<typeof orderInput>;

export type CreateOrderResult =
  | { status: "created"; orderCode: string; emailSent: boolean }
  | { status: "unavailable"; ticketTypeId: string; remaining: number }
  | { status: "invalid" };

/** Sold and remaining counts per pass; safe for the public tickets page. */
export const getTicketAvailability = createServerFn({ method: "GET" }).handler(
  async (): Promise<TicketAvailability[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { soldPerTicketType } = await import("./orders.server");

    const [{ data: types, error }, sold] = await Promise.all([
      supabaseAdmin.from("ticket_types").select("id, capacity").eq("is_published", true),
      soldPerTicketType(),
    ]);
    if (error) throw new Error(error.message);

    return (types ?? []).map((type) => {
      const soldCount = sold[type.id] ?? 0;
      return {
        ticket_type_id: type.id,
        sold: soldCount,
        remaining: type.capacity === null ? null : Math.max(type.capacity - soldCount, 0),
      };
    });
  },
);

/**
 * Creates a ticket order. Prices and availability are always re-read from the
 * database, never taken from the browser. No payment is taken yet: the order is
 * confirmed straight away, and this is the single step a payment provider would
 * later slot into (charge first, then insert with status 'confirmed').
 */
export const createTicketOrder = createServerFn({ method: "POST" })
  .inputValidator((input: CreateOrderInput) => orderInput.parse(input))
  .handler(async ({ data }): Promise<CreateOrderResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { generateOrderCode, soldPerTicketType } = await import("./orders.server");
    const { sendOrderConfirmationEmail } = await import("@/lib/email/order-email.server");

    const ids = data.items.map((item) => item.ticket_type_id);
    const { data: types, error: typesError } = await supabaseAdmin
      .from("ticket_types")
      .select("id, name_mk, name_en, price_mkd, currency, capacity, is_available, is_published, festival_id")
      .in("id", ids);
    if (typesError) throw new Error(typesError.message);

    const byId = new Map((types ?? []).map((type) => [type.id, type]));
    if (byId.size !== new Set(ids).size) return { status: "invalid" };

    const sold = await soldPerTicketType();

    for (const item of data.items) {
      const type = byId.get(item.ticket_type_id)!;
      if (!type.is_available || !type.is_published) {
        return { status: "unavailable", ticketTypeId: type.id, remaining: 0 };
      }
      if (type.capacity !== null) {
        const remaining = Math.max(type.capacity - (sold[type.id] ?? 0), 0);
        if (item.quantity > remaining) {
          return { status: "unavailable", ticketTypeId: type.id, remaining };
        }
      }
    }

    const total = data.items.reduce(
      (sum, item) => sum + Number(byId.get(item.ticket_type_id)!.price_mkd) * item.quantity,
      0,
    );
    const currency = byId.get(data.items[0]!.ticket_type_id)!.currency;
    const festivalId = byId.get(data.items[0]!.ticket_type_id)!.festival_id;
    const orderCode = generateOrderCode();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("ticket_orders")
      .insert({
        order_code: orderCode,
        festival_id: festivalId,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email.toLowerCase(),
        buyer_phone: data.buyer_phone ? data.buyer_phone : null,
        locale: data.locale,
        status: "confirmed",
        total_mkd: total,
        currency,
      })
      .select("id, order_code")
      .single();
    if (orderError || !order) throw new Error(orderError?.message ?? "Order could not be created");

    const { error: itemsError } = await supabaseAdmin.from("ticket_order_items").insert(
      data.items.map((item) => ({
        order_id: order.id,
        ticket_type_id: item.ticket_type_id,
        quantity: item.quantity,
        unit_price_mkd: Number(byId.get(item.ticket_type_id)!.price_mkd),
      })),
    );
    if (itemsError) {
      // Keep the database clean if the line items fail to store.
      await supabaseAdmin.from("ticket_orders").delete().eq("id", order.id);
      throw new Error(itemsError.message);
    }

    const { data: festival } = await supabaseAdmin
      .from("festivals")
      .select("name, start_date, end_date, location_name")
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    const email = await sendOrderConfirmationEmail({
      orderId: order.id,
      orderCode: order.order_code,
      buyerName: data.buyer_name,
      buyerEmail: data.buyer_email.toLowerCase(),
      locale: data.locale,
      currency,
      total,
      items: data.items.map((item) => {
        const type = byId.get(item.ticket_type_id)!;
        return {
          name: data.locale === "mk" ? type.name_mk : type.name_en,
          quantity: item.quantity,
          unitPrice: Number(type.price_mkd),
        };
      }),
      festivalName: festival?.name ?? "WhenInKrusevo",
      festivalDates: `${festival?.start_date ?? ""} – ${festival?.end_date ?? ""}`,
      festivalLocation: festival?.location_name ?? "Krusevo, North Macedonia",
    });

    if (email.sent) {
      await supabaseAdmin
        .from("ticket_orders")
        .update({ confirmation_email_sent_at: new Date().toISOString() })
        .eq("id", order.id);
    }

    return { status: "created", orderCode: order.order_code, emailSent: email.sent };
  });

/** Looks up one order by its unguessable code, for the confirmation page. */
export const getOrderByCode = createServerFn({ method: "GET" })
  .inputValidator((input: { code: string }) =>
    z.object({ code: z.string().trim().min(8).max(32) }).parse(input),
  )
  .handler(async ({ data }): Promise<OrderView | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("ticket_orders")
      .select(
        "id, order_code, buyer_name, buyer_email, buyer_phone, status, total_mkd, currency, locale, notes, confirmation_email_sent_at, created_at, items:ticket_order_items(id, ticket_type_id, quantity, unit_price_mkd, ticket:ticket_types(name_mk, name_en))",
      )
      .eq("order_code", data.code.toUpperCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) return null;

    return {
      ...order,
      total_mkd: Number(order.total_mkd),
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        ticket_type_id: item.ticket_type_id,
        quantity: item.quantity,
        unit_price_mkd: Number(item.unit_price_mkd),
        name_mk: item.ticket?.name_mk ?? "",
        name_en: item.ticket?.name_en ?? "",
      })),
    };
  });
