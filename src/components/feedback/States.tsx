import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type StateProps = {
  title?: string | undefined;
  description?: string | undefined;
  className?: string | undefined;
  action?: ReactNode | undefined;
};

function StateShell({
  icon,
  title,
  description,
  action,
  className,
}: StateProps & { icon: ReactNode }) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-title">{title}</p>
      {description ? <p className="text-body max-w-md text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}

export function LoadingState({ className, label }: { className?: string; label?: string }) {
  const { t } = useI18n();
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center justify-center gap-3 py-16 text-muted-foreground", className)}
    >
      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      <span className="text-body">{label ?? t("state.loading")}</span>
    </div>
  );
}

export function EmptyState({ title, description, className, action }: StateProps) {
  const { t } = useI18n();
  return (
    <StateShell
      icon={<Inbox className="size-7" aria-hidden="true" />}
      title={title ?? t("state.empty.title")}
      description={description ?? t("state.empty.body")}
      action={action}
      className={className}
    />
  );
}

export function ErrorState({
  title,
  description,
  className,
  onRetry,
}: StateProps & { onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <StateShell
      icon={<AlertTriangle className="size-7" aria-hidden="true" />}
      title={title ?? t("state.error.title")}
      description={description ?? t("state.error.body")}
      className={className}
      action={
        onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t("cta.retry")}
          </Button>
        ) : undefined
      }
    />
  );
}
