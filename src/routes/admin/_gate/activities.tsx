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
import { adminActivitiesQuery } from "@/lib/content/admin-queries";
import { updateActivity } from "@/lib/content/orders-admin.functions";
import type { Activity } from "@/lib/content/types";
import { formatDuration, formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/_gate/activities")({
  head: () => ({
    meta: [
      { title: "Activities — WhenInKrusevo admin" },
      { name: "description", content: "All festival activities and experiences." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminActivitiesPage,
});

function AdminActivitiesPage() {
  const { t, locale, pick } = useI18n();
  const queryClient = useQueryClient();
  const { data: activities } = useSuspenseQuery(adminActivitiesQuery());
  const [editing, setEditing] = useState<Activity | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof updateActivity>[0]["data"]) =>
      updateActivity({ data: input }),
    onSuccess: async () => {
      setFeedback(t("admin.activities.saved"));
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: () => setFeedback(t("admin.tickets.saveError")),
  });

  function startEdit(activity: Activity) {
    setFeedback(null);
    setPublished(activity.is_published);
    setFeatured(activity.is_featured);
    setEditing(activity);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const str = (k: string) => String(form.get(k) ?? "").trim();
    const hours = Number(str("hours") || 0);
    const minutes = Number(str("minutes") || 0);
    const total = hours * 60 + minutes;
    mutation.mutate({
      id: editing.id,
      title_mk: str("title_mk"),
      title_en: str("title_en"),
      description_mk: str("description_mk"),
      description_en: str("description_en"),
      category: str("category"),
      difficulty: str("difficulty"),
      price_mkd: Number(str("price") || 0),
      duration_minutes: total > 0 ? total : null,
      capacity: str("capacity") === "" ? null : Number(str("capacity")),
      is_published: published,
      is_featured: featured,
    });
  }

  const columns: AdminColumn<Activity>[] = [
    { key: "title", header: t("admin.table.title"), cell: (row) => pick(row.title_mk, row.title_en) },
    { key: "category", header: t("admin.table.category"), cell: (row) => row.category ?? "—" },
    {
      key: "duration",
      header: t("activities.duration"),
      cell: (row) => formatDuration(row.duration_minutes, locale),
    },
    { key: "price", header: t("admin.table.price"), cell: (row) => formatPrice(row.price_mkd, locale) },
    {
      key: "status",
      header: t("admin.table.status"),
      cell: (row) => <StatusBadge published={row.is_published} />,
    },
    {
      key: "actions",
      header: t("admin.activities.edit"),
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => startEdit(row)}>
          {t("admin.activities.edit")}
        </Button>
      ),
    },
  ];

  const field = (id: string, label: string, props: React.ComponentProps<typeof Input>) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );

  return (
    <AdminShell title={t("admin.nav.activities")}>
      {feedback ? (
        <p role="status" className="mb-4 text-sm text-muted-foreground">
          {feedback}
        </p>
      ) : null}
      <AdminTable rows={activities} columns={columns} caption={t("admin.nav.activities")} />

      <Dialog open={editing !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {editing ? (
            <form onSubmit={onSubmit} className="space-y-5">
              <DialogHeader>
                <DialogTitle>{t("admin.activities.edit")}</DialogTitle>
                <DialogDescription>{editing.slug}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                {field("title_mk", `${t("admin.table.title")} (МК)`, { defaultValue: editing.title_mk, required: true })}
                {field("title_en", `${t("admin.table.title")} (EN)`, { defaultValue: editing.title_en, required: true })}
                <div className="space-y-2">
                  <Label htmlFor="price">{t("admin.table.price")} (MKD)</Label>
                  <Input id="price" name="price" type="number" min={0} step={10} defaultValue={Number(editing.price_mkd ?? 0)} required />
                  <p className="text-xs text-muted-foreground">{t("admin.activities.priceHint")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">{t("activities.spots")}</Label>
                  <Input id="capacity" name="capacity" type="number" min={0} defaultValue={editing.capacity ?? ""} />
                  <p className="text-xs text-muted-foreground">{t("admin.tickets.capacityHint")}</p>
                </div>
                {field("hours", `${t("activities.duration")} — ${t("admin.activities.hours")}`, {
                  type: "number", min: 0, defaultValue: Math.floor((editing.duration_minutes ?? 0) / 60),
                })}
                {field("minutes", `${t("activities.duration")} — ${t("admin.activities.minutes")}`, {
                  type: "number", min: 0, max: 59, defaultValue: (editing.duration_minutes ?? 0) % 60,
                })}
                {field("category", t("admin.table.category"), { defaultValue: editing.category ?? "" })}
                {field("difficulty", t("activities.difficulty"), { defaultValue: editing.difficulty ?? "" })}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description_mk">{t("admin.table.message")} (МК)</Label>
                  <Textarea id="description_mk" name="description_mk" rows={3} defaultValue={editing.description_mk ?? ""} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description_en">{t("admin.table.message")} (EN)</Label>
                  <Textarea id="description_en" name="description_en" rows={3} defaultValue={editing.description_en ?? ""} />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
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
