"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategorySpendingChart } from "./CategorySpendingChart";
import AccountMonthlySummary from "@/components/accounts/AccountMonthlySummary";
import { Account } from "@/models/account";
import { CategorySummary } from "../charts/accounts/CategoryExpensesChart";
import { MonthlySummary } from "../charts/accounts/MonthlySummaryChart";

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
