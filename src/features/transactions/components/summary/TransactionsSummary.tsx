"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/shared/utils";
import { useTranslations } from "next-intl";

interface TransactionsSummaryProps {
  totalIncome?: string;
  totalExpenses?: string;
  balance?: string;
  currency?: string;
}

export function TransactionsSummary({
  totalIncome,
  totalExpenses,
  balance,
}: TransactionsSummaryProps) {
  const t = useTranslations("TRANSACTIONS");
  const stats = [
    {
      label: t("TOTAL_INCOME"),
      value: totalIncome,
      icon: TrendingUp,
      iconClass: "text-accent bg-accent/10",
    },
    {
      label: t("TOTAL_EXPENSE"),
      value: totalExpenses,
      icon: TrendingDown,
      iconClass: "text-destructive bg-destructive/10",
    },
    {
      label: t("BALANCE"),
      value: balance,
      icon: Wallet,
      iconClass:
        (balance ?? 0 >= 0) ? "text-accent bg-accent/10" : "text-destructive bg-destructive/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 px-4">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                stat.iconClass
              )}
            >
              <stat.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={"text-lg font-bold truncate"}>{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
