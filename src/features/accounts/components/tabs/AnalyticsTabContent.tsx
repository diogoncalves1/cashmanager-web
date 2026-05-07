"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategorySpendingChart } from "@/features/accounts/components/charts/CategorySpendingChart";
import AccountMonthlySummary from "@/features/accounts/components/cards/AccountMonthlySummary";
import { Account } from "@/features/accounts/types/index";
import { CategorySummary } from "@/features/accounts/components/charts/CategoryExpensesChart";
import { MonthlySummary } from "@/features/accounts/components/charts/MonthlySummaryChart";

interface AnalyticsTabContentProps {
  account: Account;
  pageData: {
    account?: Account;
    monthlySummary: MonthlySummary[];
    categorySummary: CategorySummary;
  };
  isLoading?: boolean;
}

export function AnalyticsTabContent({ account, pageData, isLoading }: AnalyticsTabContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[250px] w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <CategorySpendingChart
          currency={account.currency?.code || "USD"}
          isLoading={isLoading}
          categoriesData={pageData.categorySummary}
        />
        <AccountMonthlySummary data={pageData.monthlySummary} />
      </div>
    </div>
  );
}
