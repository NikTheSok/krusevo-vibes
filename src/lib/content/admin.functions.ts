import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import type { Activity, Artist, ContactMessage, FestivalLocation, GalleryItem, NewsletterSubscriber, TicketType } from "./types";

export type AdminEventRow = {
  id: string;
  title_mk: string;
  title_en: string;
  category: string | null;
  starts_at: string;
  is_published: boolean;
};

export type AdminOverview = {
  isAdmin: boolean;
  counts: {
    events: number;
    activities: number;
    artists: number;
    gallery: number;
    locations: number;
    tickets: number;
    messages: number;
    newMessages: number;
    subscribers: number;
  };
  recentMessages: ContactMessage[];
  upcomingEvents: AdminEventRow[];
};

/** True when the signed-in user holds an admin or editor role. */
export const getAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean; email: string | null }> => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const isAdmin = (data ?? []).some((row) => row.role === "admin" || row.role === "editor");
    return { isAdmin, email: (context.claims?.["email"] as string | undefined) ?? null };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverview> => {
    const supabase = context.supabase;

    const countOf = async (table: "events" | "activities" | "artists" | "gallery_items" | "locations" | "ticket_types" | "contact_messages" | "newsletter_subscribers") => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    };

    const [events, activities, artists, gallery, locations, tickets, messages, subscribers] =
      await Promise.all([
        countOf("events"),
        countOf("activities"),
        countOf("artists"),
        countOf("gallery_items"),
        countOf("locations"),
        countOf("ticket_types"),
        countOf("contact_messages"),
        countOf("newsletter_subscribers"),
      ]);

    const { count: newMessages } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    const { data: recentMessages, error: messagesError } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (messagesError) throw new Error(messagesError.message);

    const { data: upcomingEvents, error: eventsError } = await supabase
      .from("events")
      .select("id, title_mk, title_en, category, starts_at, is_published")
      .order("starts_at", { ascending: true })
      .limit(5);
    if (eventsError) throw new Error(eventsError.message);

    return {
      isAdmin: true,
      counts: {
        events,
        activities,
        artists,
        gallery,
        locations,
        tickets,
        messages,
        newMessages: newMessages ?? 0,
        subscribers,
      },
      recentMessages: recentMessages ?? [],
      upcomingEvents: upcomingEvents ?? [],
    };
  });

export const listAdminEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminEventRow[]> => {
    const { data, error } = await context.supabase
      .from("events")
      .select("id, title_mk, title_en, category, starts_at, is_published")
      .order("starts_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminActivities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Activity[]> => {
    const { data, error } = await context.supabase
      .from("activities")
      .select("*")
      .order("title_en", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminArtists = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Artist[]> => {
    const { data, error } = await context.supabase
      .from("artists")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminGallery = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<GalleryItem[]> => {
    const { data, error } = await context.supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminLocations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FestivalLocation[]> => {
    const { data, error } = await context.supabase
      .from("locations")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TicketType[]> => {
    const { data, error } = await context.supabase
      .from("ticket_types")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ContactMessage[]> => {
    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<NewsletterSubscriber[]> => {
    const { data, error } = await context.supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ key: string; value: string; is_public: boolean }[]> => {
    const { data, error } = await context.supabase
      .from("site_settings")
      .select("key, value, is_public")
      .order("key", { ascending: true });
    if (error) throw new Error(error.message);
    // JSON values are serialized as strings so they cross the RPC boundary safely.
    return (data ?? []).map((row) => ({
      key: row.key,
      value: JSON.stringify(row.value, null, 2),
      is_public: row.is_public,
    }));
  });
