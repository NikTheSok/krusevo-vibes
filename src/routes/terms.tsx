import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";
import { pageQuery } from "@/lib/content/queries";

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("terms")),
  head: () => ({
    meta: [
      { title: "Terms and conditions — VIDIK Festival" },
      {
        name: "description",
        content: "Terms of sale and festival rules for visitors of VIDIK Festival in Krusevo.",
      },
      { property: "og:title", content: "Terms and conditions — VIDIK Festival" },
      { property: "og:description", content: "Ticket terms and festival rules." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => <LegalPage slug="terms" fallbackTitle="Terms" />,
});
