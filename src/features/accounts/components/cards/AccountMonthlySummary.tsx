"use client";

import {
  MonthlySummary,
  MonthlySummaryChart,
} from "@/features/accounts/components/charts/MonthlySummaryChart";
import { memo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

type AccountMonthlySummaryProps = {
  data: MonthlySummary[];
};

function AccountMonthlySummary({ data }: AccountMonthlySummaryProps) {
  const t = useTranslations("ACCOUNTS");

  // if (isLoading) {
  //   return (
  //     <Card className="rounded-2xl border-0 shadow-sm">
  //       <CardHeader>
  //         <Skeleton className="h-6 w-56" />
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         <div className="flex gap-3">
  //           <Skeleton className="h-9 w-32" />
  //           <Skeleton className="h-9 w-32" />
  //         </div>
  //         <Skeleton className="h-[400px] w-full rounded-xl" />
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("MONTHLY_RESUME")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">{t("NO_DATA_AVAILABLE")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{t("MONTHLY_RESUME")}</h2>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.map((monthData, idx) => {
            return <MonthlySummaryChart data={monthData || []} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(AccountMonthlySummary);
