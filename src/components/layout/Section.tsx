import type { HTMLAttributes, ReactNode } from "react";

import { Container } from "./Container";
import { cn } from "@/lib/utils";

type SectionProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  tone?: "paper" | "ink" | "muted";
  spacing?: "sm" | "md" | "lg";
  container?: "narrow" | "default" | "wide" | "full";
  children: ReactNode;
};

const TONES: Record<NonNullable<SectionProps["tone"]>, string> = {
  paper: "bg-background text-foreground",
  ink: "surface-ink",
  muted: "bg-muted text-foreground",
};

const SPACING: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

export function Section({
  tone = "paper",
  spacing = "md",
  container = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(TONES[tone], SPACING[spacing], className)} {...props}>
      <Container size={container}>{children}</Container>
    </section>
  );
}
