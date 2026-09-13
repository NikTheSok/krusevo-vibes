import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";
import { pageQuery } from "@/lib/content/queries";

export const Route = createFileRoute("/cookies")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("cookies")),
  head: () => ({
    meta: [
      { title: "Cookie policy — WhenInKrusevo Festival" },
      {
        name: "description",
        content: "Which cookies the WhenInKrusevo Festival website uses and how you can control them.",
      },
      { property: "og:title", content: "Cookie policy — WhenInKrusevo Festival" },
      { property: "og:description", content: "Cookies used on this website." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => <LegalPage slug="cookies" fallbackTitle="Cookies" />,
});
