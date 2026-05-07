"use client";

import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("BALANCE")}</p>
              <p className="text-2xl font-bold">{stats.netWorth}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="size-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("TOTAL_INCOME")}</p>
              <p className="text-2xl font-bold text-accent">{stats.totalRevenues}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="size-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("TOTAL_EXPENSE")}</p>
              <p className="text-2xl font-bold text-destructive">{stats.totalExpenses}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCard className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("ACTIVE_ACCOUNTS")}</p>
              <p className="text-2xl font-bold">{stats.activeAccounts}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
