import type { GalleryItem } from "@/lib/content/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function GalleryGrid({ items, className }: { items: GalleryItem[]; className?: string }) {
  const { pick } = useI18n();

  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, index) => (
        <li
          key={item.id}
          className={cn(
            "group relative overflow-hidden rounded-3xl bg-muted",
            index % 5 === 0 ? "sm:row-span-2 sm:aspect-[3/4]" : "aspect-[4/3]",
          )}
        >
          <img
            src={item.image_url}
            alt={pick(item.alt_mk, item.alt_en) ?? pick(item.title_mk, item.title_en) ?? ""}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {item.title_mk || item.title_en ? (
            <>
              <div className="overlay-card pointer-events-none absolute inset-0" aria-hidden="true" />
              <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-ink-foreground">
                {pick(item.title_mk, item.title_en)}
              </p>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
