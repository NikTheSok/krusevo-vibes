import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { adminTicketsQuery } from "@/lib/content/admin-queries";
import { updateTicketType } from "@/lib/content/orders-admin.functions";
import type { TicketType } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets — WhenInKrusevo admin" },
      { name: "description", content: "Ticket types, prices and availability." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminTicketsPage,
});

function AdminTicketsPage() {
  const { t, locale, pick } = useI18n();
  const queryClient = useQueryClient();
  const { data: tickets } = useSuspenseQuery(adminTicketsQuery());
  const [editing, setEditing] = useState<TicketType | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof updateTicketType>[0]["data"]) =>
      updateTicketType({ data: input }),
    onSuccess: async () => {
      setFeedback(t("admin.tickets.saved"));
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      await queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
      await queryClient.invalidateQueries({ queryKey: ["ticket-availability"] });
    },
    onError: () => setFeedback(t("admin.tickets.saveError")),
  });

  function startEdit(ticket: TicketType) {
    setFeedback(null);
    setAvailable(ticket.is_available);
    setPublished(ticket.is_published);
    setFeatured(ticket.is_featured);
    setEditing(ticket);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const capacityRaw = String(form.get("capacity") ?? "").trim();
    const toLines = (value: string) =>
      value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    mutation.mutate({
      id: editing.id,
      name_mk: String(form.get("name_mk") ?? "").trim(),
      name_en: String(form.get("name_en") ?? "").trim(),
      description_mk: String(form.get("description_mk") ?? "").trim(),
      description_en: String(form.get("description_en") ?? "").trim(),
      price_mkd: Number(form.get("price") ?? 0),
      capacity: capacityRaw === "" ? null : Number(capacityRaw),
      perks_mk: toLines(String(form.get("perks_mk") ?? "")),
      perks_en: toLines(String(form.get("perks_en") ?? "")),
      is_available: available,
      is_published: published,
      is_featured: featured,
    });
  }

  const columns: AdminColumn<TicketType>[] = [
    { key: "name", header: t("admin.table.name"), cell: (row) => pick(row.name_mk, row.name_en) },
    {
      key: "price",
      header: t("admin.table.price"),
      cell: (row) => formatPrice(Number(row.price_mkd), locale, row.currency),
    },
    { key: "capacity", header: t("tickets.capacity"), cell: (row) => row.capacity ?? "—" },
    {
      key: "availability",
      header: t("admin.table.status"),
      cell: (row) =>
        row.is_available ? <StatusBadge published={row.is_published} /> : t("tickets.soldout"),
    },
    {
      key: "actions",
      header: t("admin.tickets.edit"),
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => startEdit(row)}>
          {t("admin.tickets.edit")}
        </Button>
      ),
    },
  ];

  return (
    <AdminShell title={t("admin.nav.tickets")}>
      {feedback ? (
        <p role="status" className="mb-4 text-sm text-muted-foreground">
          {feedback}
        </p>
      ) : null}
      <AdminTable rows={tickets} columns={columns} caption={t("admin.nav.tickets")} />

      <Dialog open={editing !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {editing ? (
            <form onSubmit={onSubmit} className="space-y-5">
              <DialogHeader>
                <DialogTitle>{t("admin.tickets.edit")}</DialogTitle>
                <DialogDescription>{editing.slug}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name_mk">{t("admin.table.name")} (МК)</Label>
                  <Input id="name_mk" name="name_mk" defaultValue={editing.name_mk} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">{t("admin.table.name")} (EN)</Label>
                  <Input id="name_en" name="name_en" defaultValue={editing.name_en} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">{t("admin.table.price")}</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    step={50}
                    defaultValue={Number(editing.price_mkd)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">{t("tickets.capacity")}</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={0}
                    defaultValue={editing.capacity ?? ""}
                  />
                  <p className="text-xs text-muted-foreground">{t("admin.tickets.capacityHint")}</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description_mk">{t("admin.table.message")} (МК)</Label>
                  <Textarea
                    id="description_mk"
                    name="description_mk"
                    rows={2}
                    defaultValue={editing.description_mk ?? ""}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description_en">{t("admin.table.message")} (EN)</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    rows={2}
                    defaultValue={editing.description_en ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perks_mk">{t("tickets.perks")} (МК)</Label>
                  <Textarea
                    id="perks_mk"
                    name="perks_mk"
                    rows={4}
                    defaultValue={(editing.perks_mk ?? []).join("\n")}
                  />
                  <p className="text-xs text-muted-foreground">{t("admin.tickets.perksHint")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perks_en">{t("tickets.perks")} (EN)</Label>
                  <Textarea
                    id="perks_en"
                    name="perks_en"
                    rows={4}
                    defaultValue={(editing.perks_en ?? []).join("\n")}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Switch id="is_available" checked={available} onCheckedChange={setAvailable} />
                  <Label htmlFor="is_available">{t("admin.tickets.available")}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="is_published" checked={published} onCheckedChange={setPublished} />
                  <Label htmlFor="is_published">{t("admin.tickets.published")}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="is_featured" checked={featured} onCheckedChange={setFeatured} />
                  <Label htmlFor="is_featured">{t("admin.tickets.featured")}</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? t("form.sending") : t("admin.orders.save")}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  {t("admin.cancel")}
                </Button>
              </div>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
