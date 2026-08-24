import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/content/public.functions";
import { useI18n } from "@/lib/i18n";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const { t, locale } = useI18n();
  const send = useServerFn(sendContactMessage);
  const [errors, setErrors] = useState<Errors>({});

  const mutation = useMutation({
    mutationFn: (input: { name: string; email: string; subject: string; message: string }) =>
      send({ data: { ...input, locale } }),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const nextErrors: Errors = {};
    if (input.name.length < 2) nextErrors.name = t("form.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) nextErrors.email = t("form.email.invalid");
    if (input.message.length < 10) nextErrors.message = t("form.message.short");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    mutation.mutate(input, { onSuccess: () => form.reset() });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">{t("contact.form.name")}</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">{t("contact.form.email")}</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">{t("contact.form.subject")}</Label>
        <Input id="contact-subject" name="subject" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">{t("contact.form.message")}</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-sm text-destructive">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t("form.sending") : t("cta.send")}
        </Button>
        <p aria-live="polite" className="text-sm">
          {mutation.isSuccess ? (
            <span className="text-primary">{t("contact.form.success")}</span>
          ) : null}
          {mutation.isError ? (
            <span className="text-destructive">{t("contact.form.error")}</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
