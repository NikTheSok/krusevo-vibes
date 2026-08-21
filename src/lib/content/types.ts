import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export type Festival = Tables["festivals"]["Row"];
export type FestivalEvent = Tables["events"]["Row"];
export type Activity = Tables["activities"]["Row"];
export type Artist = Tables["artists"]["Row"];
export type FestivalLocation = Tables["locations"]["Row"];
export type GalleryItem = Tables["gallery_items"]["Row"];
export type Sponsor = Tables["sponsors"]["Row"];
export type TicketType = Tables["ticket_types"]["Row"];
export type Faq = Tables["faqs"]["Row"];
export type ContentPage = Tables["pages"]["Row"];
export type ContactMessage = Tables["contact_messages"]["Row"];
export type NewsletterSubscriber = Tables["newsletter_subscribers"]["Row"];

export type FestivalStat = { key: string; value: string };

export type SocialLinks = {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

export type ContactDetails = {
  email: string;
  press: string;
  phone: string;
  address: string;
};

export type EventWithRelations = FestivalEvent & {
  location: Pick<FestivalLocation, "id" | "name" | "slug"> | null;
  artist: Pick<Artist, "id" | "name" | "slug"> | null;
};

export type ActivityWithLocation = Activity & {
  location: Pick<FestivalLocation, "id" | "name" | "slug"> | null;
};
