/**
 * Ticket confirmation email.
 *
 * Sending is handled by Lovable's managed email service, which requires a
 * verified sender domain for this project. Until that domain is verified this
 * helper reports `email_domain_pending` so checkout still completes normally —
 * this is the single place where the send is wired, so nothing else changes
 * once the domain is live.
 */
export type OrderEmailItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type OrderEmailPayload = {
  orderId: string;
  orderCode: string;
  buyerName: string;
  buyerEmail: string;
  locale: "mk" | "en";
  currency: string;
  total: number;
  items: OrderEmailItem[];
  festivalName: string;
  festivalDates: string;
  festivalLocation: string;
};

export type OrderEmailResult = { sent: boolean; reason?: string };

export async function sendOrderConfirmationEmail(
  payload: OrderEmailPayload,
): Promise<OrderEmailResult> {
  console.info(
    `[tickets] confirmation email pending sender domain for order ${payload.orderCode} (${payload.buyerEmail})`,
  );
  return { sent: false, reason: "email_domain_pending" };
}
