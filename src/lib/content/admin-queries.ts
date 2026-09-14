import { queryOptions } from "@tanstack/react-query";

import {
  getAdminAccess,
  getAdminOverview,
  getAdminSettings,
  listAdminActivities,
  listAdminArtists,
  listAdminEvents,
  listAdminGallery,
  listAdminLocations,
  listAdminMessages,
  listAdminSubscribers,
  listAdminTickets,
} from "./admin.functions";
import { listAdminOrders } from "./orders-admin.functions";

const key = (...parts: string[]) => ["admin", ...parts];

export const adminAccessQuery = () =>
  queryOptions({ queryKey: key("access"), queryFn: () => getAdminAccess() });

export const adminOverviewQuery = () =>
  queryOptions({ queryKey: key("overview"), queryFn: () => getAdminOverview() });

export const adminEventsQuery = () =>
  queryOptions({ queryKey: key("events"), queryFn: () => listAdminEvents() });

export const adminActivitiesQuery = () =>
  queryOptions({ queryKey: key("activities"), queryFn: () => listAdminActivities() });

export const adminArtistsQuery = () =>
  queryOptions({ queryKey: key("artists"), queryFn: () => listAdminArtists() });

export const adminGalleryQuery = () =>
  queryOptions({ queryKey: key("gallery"), queryFn: () => listAdminGallery() });

export const adminLocationsQuery = () =>
  queryOptions({ queryKey: key("locations"), queryFn: () => listAdminLocations() });

export const adminTicketsQuery = () =>
  queryOptions({ queryKey: key("tickets"), queryFn: () => listAdminTickets() });

export const adminMessagesQuery = () =>
  queryOptions({ queryKey: key("messages"), queryFn: () => listAdminMessages() });

export const adminSubscribersQuery = () =>
  queryOptions({ queryKey: key("subscribers"), queryFn: () => listAdminSubscribers() });

export const adminSettingsQuery = () =>
  queryOptions({ queryKey: key("settings"), queryFn: () => getAdminSettings() });

export const adminOrdersQuery = () =>
  queryOptions({ queryKey: key("orders"), queryFn: () => listAdminOrders() });
