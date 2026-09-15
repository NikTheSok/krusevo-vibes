import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminOrdersQuery } from "@/lib/content/admin-queries";
import type { OrderView } from "@/lib/content/orders.functions";
import { resendOrderConfirmation, updateOrderStatus } from "@/lib/content/orders-admin.functions";
import { formatDateTime, formatPrice } from "@/lib/format";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const STATUSES: OrderView["status"][] = ["pending", "confirmed", "cancelled", "checked_in"];

export const Route = createFileRoute("/admin/_gate/orders")({
  head: () => ({
    meta: [
      { title: "Orders — WhenInKrusevo admin" },
      { name: "description", content: "Ticket orders, statuses and confirmations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { t, locale, pick } = useI18n();
  const queryClient = useQueryClient();
  const { data: orders } = useSuspenseQuery(adminOrdersQuery());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderView["status"]>("all");
  const [openOrder, setOpenOrder] = useState<OrderView | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: OrderView["status"]; notes?: string }) =>
      updateOrderStatus({ data: input }),
    onSuccess: async (order) => {
      setOpenOrder(order);
      setFeedback(t("admin.orders.statusUpdated"));
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
  });

  const resendMutation = useMutation({
    mutationFn: (id: string) => resendOrderConfirmation({ data: { id } }),
    onSuccess: (result) => {
      setFeedback(result.sent ? t("admin.orders.resent") : t("admin.orders.resendPending"));
    },
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesTerm =
        !term ||
        order.order_code.toLowerCase().includes(term) ||
        order.buyer_name.toLowerCase().includes(term) ||
        order.buyer_email.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [orders, search, statusFilter]);

  const totalTickets = (order: OrderView) =>
    order.items.reduce((sum, item) => sum + item.quantity, 0);

  const columns: AdminColumn<OrderView>[] = [
    { key: "code", header: t("order.code"), cell: (row) => row.order_code },
    {
      key: "buyer",
      header: t("order.buyer"),
      cell: (row) => (
        <span>
          {row.buyer_name}
          <br />
          <span className="text-sm text-muted-foreground">{row.buyer_email}</span>
        </span>
      ),
    },
    {
      key: "items",
      header: t("order.items"),
      cell: (row) => (
        <span className="text-sm">
          {row.items.map((item) => `${pick(item.name_mk, item.name_en)} × ${item.quantity}`).join(", ")}
        </span>
      ),
    },
    { key: "quantity", header: t("admin.orders.quantity"), cell: (row) => totalTickets(row) },
    {
      key: "total",
      header: t("order.total"),
      cell: (row) => formatPrice(row.total_mkd, locale, row.currency),
    },
    {
      key: "status",
      header: t("order.status"),
      cell: (row) => (
        <Badge variant={row.status === "cancelled" ? "destructive" : "secondary"}>
          {t(`orderStatus.${row.status}` as TranslationKey)}
        </Badge>
      ),
    },
    {
      key: "date",
      header: t("admin.table.date"),
      cell: (row) => formatDateTime(row.created_at, locale),
    },
    {
      key: "actions",
      header: t("cta.details"),
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFeedback(null);
            setOpenOrder(row);
          }}
        >
          {t("cta.details")}
        </Button>
      ),
    },
  ];

  const soldTickets = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + totalTickets(order), 0);
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total_mkd, 0);

  return (
    <AdminShell title={t("admin.orders.title")}>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <dt className="text-eyebrow text-muted-foreground">{t("admin.orders.stats.orders")}</dt>
          <dd className="font-display mt-3 text-3xl font-bold">{orders.length}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <dt className="text-eyebrow text-muted-foreground">{t("admin.orders.stats.sold")}</dt>
          <dd className="font-display mt-3 text-3xl font-bold">{soldTickets}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <dt className="text-eyebrow text-muted-foreground">{t("admin.orders.stats.revenue")}</dt>
          <dd className="font-display mt-3 text-3xl font-bold">
            {formatPrice(revenue, locale, orders[0]?.currency ?? "MKD")}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap items-end gap-4">
        <div className="min-w-64 flex-1 space-y-2">
          <Label htmlFor="order-search">{t("admin.orders.search")}</Label>
          <Input
            id="order-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("admin.orders.search")}
          />
        </div>
        <div className="w-52 space-y-2">
          <Label htmlFor="order-status-filter">{t("order.status")}</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <SelectTrigger id="order-status-filter">
              <SelectValue placeholder={t("admin.orders.filter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.orders.filter")}</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`orderStatus.${status}` as TranslationKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <AdminTable rows={rows} columns={columns} caption={t("admin.orders.title")} />
      </div>

      <Dialog
        open={openOrder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpenOrder(null);
            setFeedback(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {openOrder ? (
            <>
              <DialogHeader>
                <DialogTitle>{t("admin.orders.detail")}</DialogTitle>
                <DialogDescription>
                  {openOrder.order_code} · {formatDateTime(openOrder.created_at, locale)}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-eyebrow text-muted-foreground">{t("order.buyer")}</dt>
                  <dd className="text-body mt-1">
                    {openOrder.buyer_name}
                    <br />
                    {openOrder.buyer_email}
                    {openOrder.buyer_phone ? (
                      <>
                        <br />
                        {openOrder.buyer_phone}
                      </>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-eyebrow text-muted-foreground">{t("order.total")}</dt>
                  <dd className="text-body mt-1">
                    {formatPrice(openOrder.total_mkd, locale, openOrder.currency)}
                  </dd>
                </div>
              </dl>

              <ul className="divide-y divide-border border-y border-border">
                {openOrder.items.map((item) => (
                  <li key={item.id} className="text-body flex justify-between gap-3 py-2">
                    <span>
                      {pick(item.name_mk, item.name_en)} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.unit_price_mkd * item.quantity, locale, openOrder.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <Label htmlFor="order-status">{t("order.status")}</Label>
                <Select
                  value={openOrder.status}
                  onValueChange={(value) =>
                    statusMutation.mutate({ id: openOrder.id, status: value as OrderView["status"] })
                  }
                >
                  <SelectTrigger id="order-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`orderStatus.${status}` as TranslationKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-notes">{t("admin.orders.notes")}</Label>
                <Textarea
                  id="order-notes"
                  defaultValue={openOrder.notes ?? ""}
                  rows={3}
                  onBlur={(event) =>
                    statusMutation.mutate({
                      id: openOrder.id,
                      status: openOrder.status,
                      notes: event.target.value,
                    })
                  }
                />
              </div>

              {openOrder.confirmation_email_sent_at ? (
                <p className="text-sm text-muted-foreground">
                  {t("admin.orders.emailSent")}:{" "}
                  {formatDateTime(openOrder.confirmation_email_sent_at, locale)}
                </p>
              ) : null}

              {feedback ? (
                <p role="status" className="text-sm text-muted-foreground">
                  {feedback}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  disabled={resendMutation.isPending}
                  onClick={() => resendMutation.mutate(openOrder.id)}
                >
                  {resendMutation.isPending ? t("form.sending") : t("admin.orders.resend")}
                </Button>
                <Button variant="ghost" onClick={() => setOpenOrder(null)}>
                  {t("admin.cancel")}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
