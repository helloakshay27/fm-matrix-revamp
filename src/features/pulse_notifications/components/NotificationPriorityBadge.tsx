import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-brand-error/15 text-brand-error border-brand-error/30",
  medium: "bg-brand-warning/15 text-brand-warning border-brand-warning/30",
  normal: "bg-brand-warning/15 text-brand-warning border-brand-warning/30",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

interface NotificationPriorityBadgeProps {
  priority: string;
}

export function NotificationPriorityBadge({ priority }: NotificationPriorityBadgeProps) {
  const normalized = priority?.toLowerCase() ?? "medium";
  const style = PRIORITY_STYLES[normalized] ?? PRIORITY_STYLES.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        style
      )}
    >
      {normalized}
    </span>
  );
}
