import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export function StatusBadge({ published }: { published: boolean }) {
  const { t } = useI18n();
  return (
    <Badge variant={published ? "default" : "secondary"}>
      {published ? t("admin.published") : t("admin.draft")}
    </Badge>
  );
}
