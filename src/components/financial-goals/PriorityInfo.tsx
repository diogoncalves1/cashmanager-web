import { cn } from "@/lib/utils";
import { FinancialGoalPriority } from "@/models/financialGoal";

export default function PriorityInfo({
  priority,
  translate,
}: {
  priority: FinancialGoalPriority;
  translate?: string;
}) {
  const priorityConfig = {
    low: {
      className: "border-muted-foreground/30",
      dotColor: "bg-muted-foreground",
    },
    medium: {
      className: "border-chart-3/50",
      dotColor: "bg-chart-3",
    },
    high: {
      className: "border-destructive/50",
      dotColor: "bg-destructive",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", priorityConfig[priority].dotColor)} />
      <span className="text-xs text-muted-foreground">Priority: {translate}</span>
    </div>
  );
}
