"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Account,
  AccountMonthlySummary,
  CategorySummary,
  CategorySpendingChart,
  MonthlySummary,
} from "@/features/accounts";

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
      <div className="space-y-3">
        <div className="grid gap-3 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="rounded-md border-0 shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[250px] w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-md border-0 shadow-md">
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
    <div className="space-y-3 max-w-100 md:max-w-full">
      <div className="grid gap-3">
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
