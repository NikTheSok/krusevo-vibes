CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in');

CREATE TABLE public.ticket_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code text NOT NULL UNIQUE,
  festival_id uuid REFERENCES public.festivals(id) ON DELETE SET NULL,
  buyer_name text NOT NULL,
  buyer_email text NOT NULL,
  buyer_phone text,
  status public.order_status NOT NULL DEFAULT 'confirmed',
  total_mkd numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'MKD',
  locale text NOT NULL DEFAULT 'mk',
  notes text,
  confirmation_email_sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.ticket_orders TO authenticated;
GRANT ALL ON public.ticket_orders TO service_role;

ALTER TABLE public.ticket_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff manage orders" ON public.ticket_orders
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.ticket_order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  ticket_type_id uuid NOT NULL REFERENCES public.ticket_types(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_mkd numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ticket_order_items TO authenticated;
GRANT ALL ON public.ticket_order_items TO service_role;

ALTER TABLE public.ticket_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff manage order items" ON public.ticket_order_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX ticket_order_items_order_id_idx ON public.ticket_order_items(order_id);
CREATE INDEX ticket_order_items_ticket_type_id_idx ON public.ticket_order_items(ticket_type_id);
CREATE INDEX ticket_orders_created_at_idx ON public.ticket_orders(created_at DESC);

CREATE TRIGGER t_ticket_orders_updated BEFORE UPDATE ON public.ticket_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.ticket_sold_counts()
RETURNS TABLE (ticket_type_id uuid, sold bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.ticket_type_id, COALESCE(SUM(i.quantity), 0)::bigint AS sold
  FROM public.ticket_order_items i
  JOIN public.ticket_orders o ON o.id = i.order_id
  WHERE o.status IN ('pending', 'confirmed', 'checked_in')
  GROUP BY i.ticket_type_id;
$$;

GRANT EXECUTE ON FUNCTION public.ticket_sold_counts() TO anon, authenticated, service_role;