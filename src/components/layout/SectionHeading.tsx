import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  action?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  tone?: "default" | "ink";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  as: Heading = "h2",
  tone = "default",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <p
            className={cn(
              "text-eyebrow mb-4",
              tone === "ink" ? "text-highlight" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <Heading className="text-headline">{title}</Heading>
        {description ? (
          <p
            className={cn(
              "text-lead mt-5",
              tone === "ink" ? "text-ink-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
