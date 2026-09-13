import { DebtStatus } from "@/features/debts";
import { cn } from "@/shared/utils";

export function StatusBadge({ status, translate }: { status: DebtStatus; translate?: string }) {
  const colorMap: Record<DebtStatus, { badge: string; dot: string }> = {
    paid: {
      badge:
        "border-success-200 bg-success-50 text-success-700 dark:border-success-900/60 dark:bg-success-900/25 dark:text-success-400",
      dot: "bg-success-500",
    },
    pending: {
      badge:
        "border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-900/60 dark:bg-warning-900/25 dark:text-warning-400",
      dot: "bg-warning-500",
    },
  };
  const colorClasses = colorMap[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        colorClasses.badge
      )}
    >
      <span className={cn("size-1.5 rounded-full", colorClasses.dot)} />
      {translate}
    </span>
  );
}
