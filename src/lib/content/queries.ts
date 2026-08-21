import { queryOptions } from "@tanstack/react-query";

import {
  getActivities,
  getArtists,
  getEvents,
  getFaqs,
  getFestival,
  getGallery,
  getLocations,
  getPage,
  getSiteSettings,
  getSponsors,
  getTicketTypes,
} from "./public.functions";

export const festivalQuery = () =>
  queryOptions({ queryKey: ["festival"], queryFn: () => getFestival() });

export const eventsQuery = () => queryOptions({ queryKey: ["events"], queryFn: () => getEvents() });

export const activitiesQuery = () =>
  queryOptions({ queryKey: ["activities"], queryFn: () => getActivities() });

export const artistsQuery = () => queryOptions({ queryKey: ["artists"], queryFn: () => getArtists() });

export const locationsQuery = () =>
  queryOptions({ queryKey: ["locations"], queryFn: () => getLocations() });

export const galleryQuery = () => queryOptions({ queryKey: ["gallery"], queryFn: () => getGallery() });

export const sponsorsQuery = () => queryOptions({ queryKey: ["sponsors"], queryFn: () => getSponsors() });

export const ticketTypesQuery = () =>
  queryOptions({ queryKey: ["ticket-types"], queryFn: () => getTicketTypes() });

export const faqsQuery = () => queryOptions({ queryKey: ["faqs"], queryFn: () => getFaqs() });

export const siteSettingsQuery = () =>
  queryOptions({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() });

export const pageQuery = (slug: string) =>
  queryOptions({ queryKey: ["page", slug], queryFn: () => getPage({ data: { slug } }) });
