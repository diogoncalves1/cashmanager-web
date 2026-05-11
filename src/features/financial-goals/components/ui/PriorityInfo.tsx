import { cn } from "@/shared/utils";
import { FinancialGoalPriority } from "@/features/financial-goals";

export function PriorityInfo({
  priority,
  translate,
}: {
  priority: FinancialGoalPriority;
  translate?: string;
}) {
  const priorityConfig = {
    low: {
      className: "text-muted-foreground",
      dotColor: "bg-muted-foreground",
    },
    medium: {
      className: "text-chart-3",
      dotColor: "bg-chart-3",
    },
    high: {
      className: "text-destructive",
      dotColor: "bg-destructive",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", priorityConfig[priority].dotColor)} />
      <span className={cn("text-xs text-muted-foreground", priorityConfig[priority].className)}>
        Priority: {translate}
      </span>
    </div>
  );
}
