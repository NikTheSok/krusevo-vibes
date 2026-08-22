import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/content/public.functions";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function NewsletterForm({ tone = "ink" }: { tone?: "ink" | "default" }) {
  const { t, locale } = useI18n();
  const subscribe = useServerFn(subscribeToNewsletter);
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (value: string) => subscribe({ data: { email: value, locale } }),
    onSuccess: () => setEmail(""),
  });

  const message = mutation.isError
    ? t("newsletter.error")
    : mutation.data?.status === "already"
      ? t("newsletter.duplicate")
      : mutation.data?.status === "subscribed"
        ? t("newsletter.success")
        : null;

  return (
    <form
      className="w-full max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim().length > 3) mutation.mutate(email.trim());
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t("newsletter.email")}
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("newsletter.email")}
          className={cn(
            "h-12 rounded-full px-5",
            tone === "ink" && "border-ink-border bg-ink text-ink-foreground placeholder:text-ink-muted",
          )}
        />
        <Button type="submit" variant="highlight" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? t("form.sending") : t("cta.subscribe")}
        </Button>
      </div>
      <p
        aria-live="polite"
        className={cn("mt-3 text-sm", tone === "ink" ? "text-ink-muted" : "text-muted-foreground")}
      >
        {message ?? t("newsletter.consent")}
      </p>
    </form>
  );
}
