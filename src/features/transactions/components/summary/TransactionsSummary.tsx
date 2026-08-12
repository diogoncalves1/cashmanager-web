"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

interface TransactionsSummaryProps {
  totalIncome?: string;
  totalExpenses?: string;
  balance?: string;
  currency?: string;
  isLoading?: boolean;
}

type SummaryValues = {
  totalIncome?: string;
  totalExpenses?: string;
  balance?: string;
};

export function TransactionsSummary({
  totalIncome,
  totalExpenses,
  balance,
  isLoading = false,
}: TransactionsSummaryProps) {
  const t = useTranslations("TRANSACTIONS");

  // Guarda os últimos valores válidos. Se o fetch limpar os dados
  // enquanto um refetch está a decorrer, continuamos a mostrar estes
  // valores (esbatidos, com spinner por cima) em vez de ficar sem nada.
  const [cached, setCached] = useState<SummaryValues>({
    totalIncome,
    totalExpenses,
    balance,
  });

  const hasIncomingData =
    totalIncome !== undefined || totalExpenses !== undefined || balance !== undefined;

  useEffect(() => {
    if (!isLoading && hasIncomingData) {
      setCached({ totalIncome, totalExpenses, balance });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, totalIncome, totalExpenses, balance]);

  const displayIncome = hasIncomingData ? totalIncome : cached.totalIncome;
  const displayExpenses = hasIncomingData ? totalExpenses : cached.totalExpenses;
  const displayBalance = hasIncomingData ? balance : cached.balance;

  const hasCachedData =
    cached.totalIncome !== undefined ||
    cached.totalExpenses !== undefined ||
    cached.balance !== undefined;

  const isRefetching = isLoading && (hasIncomingData || hasCachedData);
  const isInitialLoading = isLoading && !hasIncomingData && !hasCachedData;

  const stats = [
    {
      label: t("TOTAL_INCOME"),
      value: displayIncome,
      icon: TrendingUp,
      iconClass: "text-accent bg-accent/10",
    },
    {
      label: t("TOTAL_EXPENSE"),
      value: displayExpenses,
      icon: TrendingDown,
      iconClass: "text-destructive bg-destructive/10",
    },
    {
      label: t("BALANCE"),
      value: displayBalance,
      icon: Wallet,
      iconClass:
        (displayBalance ?? 0 >= 0)
          ? "text-accent bg-accent/10"
          : "text-destructive bg-destructive/10",
    },
  ];

  return (
    <div className="relative">
      {isRefetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-[1px] rounded-lg">
          <Spinner className="size-5 text-muted-foreground" />
        </div>
      )}

      <div
        className={cn(
          "grid gap-3 sm:grid-cols-3 transition-opacity duration-150",
          isRefetching && "opacity-40 pointer-events-none"
        )}
      >
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white rounded-lg border-none shadow-md">
            <CardContent className="flex items-center gap-3 px-4">
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
                <p className="text-lg font-bold truncate">{isInitialLoading ? "—" : stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
