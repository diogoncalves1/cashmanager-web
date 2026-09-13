"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FinancialGoal, StatusBadge, PriorityInfo } from "@/features/financial-goals";
import { SummaryCard } from "@/shared/ui/summary-card";
import { formatCurrency } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { Target } from "lucide-react";

interface GoalCardProps {
  financialGoal: FinancialGoal;
  onClick?: () => void;
}

export function GoalCard({ financialGoal }: GoalCardProps) {
  const t = useTranslations("FINANCIAL_GOALS");
  const progress =
    financialGoal.totalAmount > 0
      ? Math.min(Math.round((financialGoal.contributedAmount / financialGoal.totalAmount) * 100), 100)
      : 0;
  const remaining = financialGoal.totalAmount - financialGoal.contributedAmount;
  const isCompleted = financialGoal.status === "completed";

  return (
    <SummaryCard
      href={`/financial-goals/${financialGoal.id}`}
      progress={progress}
      progressColorClassName={isCompleted ? "bg-chart-1" : "bg-accent"}
      icon={<Target className="size-4" strokeWidth={1.75} />}
      iconClassName={isCompleted ? "bg-chart-1/10 text-chart-1" : "bg-accent/10 text-accent"}
      header={
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
              {financialGoal.name}
            </h3>
          </div>
          <StatusBadge status={financialGoal.status} translate={financialGoal.statusTranslated} />
        </div>
      }
      progressTop={
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("PROGRESS")}</span>
          <span className="font-semibold text-foreground tabular-nums">{progress}%</span>
        </div>
      }
      stats={[
        { label: t("TOTAL"), value: financialGoal.totalAmountFormated },
        {
          label: t("CONTRIBUTED"),
          value: financialGoal.contributedAmountFormated,
          valueClassName: "text-accent",
        },
        {
          label: t("REMAINING"),
          value: formatCurrency(remaining, financialGoal.contributedAmountFormated),
        },
      ]}
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <PriorityInfo
            priority={financialGoal.priority}
            translate={financialGoal.priorityTranslated}
          />

          {financialGoal.users && financialGoal.users.length > 0 && (
            <div className="flex items-center -space-x-2">
              {financialGoal.users.slice(0, 3).map((user) => (
                <Avatar key={user.id} className="size-7 border-2 border-card">
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
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted">
                  <span className="text-[10px] text-muted-foreground font-medium">
                    +{financialGoal.users.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      }
    />
  );
}
export default GoalCard;
