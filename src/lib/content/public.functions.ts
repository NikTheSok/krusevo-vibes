import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type {
  ActivityWithLocation,
  Artist,
  ContactDetails,
  ContentPage,
  EventWithRelations,
  Faq,
  Festival,
  FestivalLocation,
  GalleryItem,
  SocialLinks,
  Sponsor,
  TicketType,
} from "./types";

const emailSchema = z.string().trim().min(3).max(320).email();

export const getFestival = createServerFn({ method: "GET" }).handler(async (): Promise<Festival | null> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("festivals")
    .select("*")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

export const getEvents = createServerFn({ method: "GET" }).handler(async (): Promise<EventWithRelations[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("events")
    .select("*, location:locations(id, name, slug), artist:artists(id, name, slug)")
    .order("starts_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as EventWithRelations[];
});

export const getActivities = createServerFn({ method: "GET" }).handler(
  async (): Promise<ActivityWithLocation[]> => {
    const { publicClient } = await import("./supabase-public.server");
    const { data, error } = await publicClient()
      .from("activities")
      .select("*, location:locations(id, name, slug)")
      .order("is_featured", { ascending: false })
      .order("title_en", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ActivityWithLocation[];
  },
);

export const getArtists = createServerFn({ method: "GET" }).handler(async (): Promise<Artist[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("artists")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getLocations = createServerFn({ method: "GET" }).handler(async (): Promise<FestivalLocation[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getGallery = createServerFn({ method: "GET" }).handler(async (): Promise<GalleryItem[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getSponsors = createServerFn({ method: "GET" }).handler(async (): Promise<Sponsor[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("sponsors")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getTicketTypes = createServerFn({ method: "GET" }).handler(async (): Promise<TicketType[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("ticket_types")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getFaqs = createServerFn({ method: "GET" }).handler(async (): Promise<Faq[]> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPage = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }): Promise<ContentPage | null> => {
    const { publicClient } = await import("./supabase-public.server");
    const { data: page, error } = await publicClient()
      .from("pages")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return page;
  });

export type SiteSettings = { social: SocialLinks; contact: ContactDetails };

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async (): Promise<SiteSettings> => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient().from("site_settings").select("key, value");
  if (error) throw new Error(error.message);

  const map = new Map((data ?? []).map((row) => [row.key, row.value]));
  return {
    social: (map.get("social") ?? {
      instagram: "",
      facebook: "",
      youtube: "",
      tiktok: "",
    }) as SocialLinks,
    contact: (map.get("contact") ?? {
      email: "",
      press: "",
      phone: "",
      address: "",
    }) as ContactDetails,
  };
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; locale: string }) =>
    z.object({ email: emailSchema, locale: z.enum(["mk", "en"]) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ status: "subscribed" | "already" }> => {
    const { publicClient } = await import("./supabase-public.server");
    const { error } = await publicClient()
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase(), locale: data.locale });

    if (error) {
      if (error.code === "23505") return { status: "already" };
      throw new Error(error.message);
    }
    return { status: "subscribed" };
  });

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { name: string; email: string; subject: string; message: string; locale: string }) =>
      z
        .object({
          name: z.string().trim().min(2).max(120),
          email: emailSchema,
          subject: z.string().trim().max(160).default(""),
          message: z.string().trim().min(10).max(4000),
          locale: z.enum(["mk", "en"]),
        })
        .parse(input),
  )
  .handler(async ({ data }): Promise<{ status: "sent" }> => {
    const { publicClient } = await import("./supabase-public.server");
    const { error } = await publicClient().from("contact_messages").insert({
      name: data.name,
      email: data.email.toLowerCase(),
      subject: data.subject || null,
      message: data.message,
      locale: data.locale,
    });
    if (error) throw new Error(error.message);
    return { status: "sent" };
  });
