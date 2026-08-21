import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  size?: "narrow" | "default" | "wide" | "full";
};

const SIZES: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[88rem]",
  full: "max-w-none",
};

export function Container({ as: Tag = "div", size = "default", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", SIZES[size], className)} {...props} />;
}
