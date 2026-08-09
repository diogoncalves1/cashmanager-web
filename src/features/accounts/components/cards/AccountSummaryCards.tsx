"use client";

import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils";

type Stats = {
  activeAccounts?: number;
  netWorth?: string;
  totalRevenues?: string;
  totalExpenses?: string;
};

interface AccountSummaryCardsProps {
  stats: Stats;
}

export function AccountSummaryCards({ stats }: AccountSummaryCardsProps) {
  const t = useTranslations("ACCOUNTS");

  const cards = [
    {
      icon: Wallet,
      label: t("BALANCE"),
      value: stats.netWorth,
      iconClass: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
      valueClass: "text-gray-900 dark:text-gray-100",
    },
    {
      icon: TrendingUp,
      label: t("TOTAL_INCOME"),
      value: stats.totalRevenues,
      iconClass: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
      valueClass: "text-success-600 dark:text-success-400",
    },
    {
      icon: TrendingDown,
      label: t("TOTAL_EXPENSE"),
      value: stats.totalExpenses,
      iconClass: "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400",
      valueClass: "text-red-500 dark:text-red-400",
    },
    {
      icon: CreditCard,
      label: t("ACTIVE_ACCOUNTS"),
      value: stats.activeAccounts,
      iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      valueClass: "text-gray-900 dark:text-gray-100",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg bg-white shadow-md px-6 py-10 dark:bg-gray-800/60"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg",
                card.iconClass
              )}
            >
              <card.icon className="size-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className={cn("text-2xl font-bold", card.valueClass)}>{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
