import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";
import { pageQuery } from "@/lib/content/queries";

export const Route = createFileRoute("/privacy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("privacy")),
  head: () => ({
    meta: [
      { title: "Privacy policy — WhenInKrusevo Festival" },
      {
        name: "description",
        content: "How WhenInKrusevo Festival collects, uses and protects personal data of visitors and subscribers.",
      },
      { property: "og:title", content: "Privacy policy — WhenInKrusevo Festival" },
      { property: "og:description", content: "Our approach to your personal data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => <LegalPage slug="privacy" fallbackTitle="Privacy" />,
});
