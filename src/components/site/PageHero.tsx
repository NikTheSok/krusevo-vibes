import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  children?: ReactNode;
};

/** Compact cinematic header used by every inner public page. */
export function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  return (
    <section className="relative -mt-18 surface-ink pt-18">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover opacity-45"
          />
          <div className="overlay-cinematic absolute inset-0" aria-hidden="true" />
        </>
      ) : null}
      <Container size="wide" className="relative py-16 sm:py-24">
        {eyebrow ? <p className="text-eyebrow text-highlight">{eyebrow}</p> : null}
        <h1 className="text-headline mt-4 max-w-4xl">{title}</h1>
        {description ? <p className="text-lead mt-5 max-w-2xl text-ink-muted">{description}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}
