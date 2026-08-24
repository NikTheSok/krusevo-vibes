import { useSuspenseQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/feedback/States";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/site/PageHero";
import { pageQuery } from "@/lib/content/queries";
import { useI18n } from "@/lib/i18n";

/** Renders a CMS-managed content page (privacy, cookies, terms, …). */
export function LegalPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { pick } = useI18n();
  const { data: page } = useSuspenseQuery(pageQuery(slug));

  const title = pick(page?.title_mk, page?.title_en) ?? fallbackTitle;
  const body = pick(page?.body_mk, page?.body_en) ?? "";
  const blocks = body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <PageHero title={title} />
      <Section container="narrow" spacing="md">
        {blocks.length ? (
          <div className="space-y-5">
            {blocks.map((block, index) =>
              block.startsWith("## ") ? (
                <h2 key={index} className="text-title pt-6">
                  {block.replace(/^##\s+/, "")}
                </h2>
              ) : (
                <p key={index} className="text-body text-muted-foreground">
                  {block}
                </p>
              ),
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </Section>
    </>
  );
}
