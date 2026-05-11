"use client";

import Link from "next/link";
import { cn } from "@/shared/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FinancialGoal, StatusBadge, PriorityInfo } from "@/features/financial-goals";
import { useTranslations } from "next-intl";

interface GoalCardProps {
  financialGoal: FinancialGoal;
  onClick?: () => void;
}

export function GoalCard({ financialGoal }: GoalCardProps) {
  const t = useTranslations("FINANCIAL_GOALS");
  const progress = Math.min(
    Math.round((financialGoal.contributedAmount / financialGoal.totalAmount) * 100),
    100
  );
  const remaining = financialGoal.totalAmount - financialGoal.contributedAmount;

  return (
    <Link
      href={`/financial-goals/${financialGoal.id}`}
      className={cn(
        "group relative p-5 rounded-2xl bg-card border border-border block",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "cursor-pointer hover:border-accent/30"
      )}
    >
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-semibold text-foreground text-lg leading-tight text-balance">
          {financialGoal.name}
        </h3>
        <StatusBadge status={financialGoal.status} translate={financialGoal.statusTranslated} />
      </div>

      {/* Progress Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            {financialGoal.contributedAmountFormated}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("OF")} {financialGoal.totalAmountFormated}
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              status === "completed" ? "bg-chart-1" : "bg-accent"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-accent font-medium">
            {progress}% {t("P_COMPLETE")}
          </span>
          {remaining > 0 && (
            <span className="text-muted-foreground">
              {/* {formatCurrency(remaining, financialGoal.currencyCode)} remaining */}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Priority + Users */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <PriorityInfo
          priority={financialGoal.priority}
          translate={financialGoal.priorityTranslated}
        />

        {financialGoal.users && financialGoal.users.length > 0 && (
          <div className="flex items-center -space-x-2">
            {financialGoal.users.slice(0, 3).map((user) => (
              <Avatar key={user.id} className="w-7 h-7 border-2 border-card">
                <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {financialGoal.users.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground font-medium">
                  +{financialGoal.users.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
export default GoalCard;
