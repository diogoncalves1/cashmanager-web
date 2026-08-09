"use client";

import { formatDate } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@/shared/utils";

export type MonthlySummary = {
  month: string;
  totalRevenue: number;
  totalRevenueFormated: string;
  totalRevenueFormatedWithoutSymbol: string;
  totalExpense: number;
  totalExpenseFormated: string;
  totalExpenseFormatedWithoutSymbol: string;
  profit: string;
  profitFormated: string;
  total: string;
};

type MonthlySummaryProps = {
  data: MonthlySummary;
};

const INCOME_COLOR = "#00935D";
const EXPENSE_COLOR = "#ef4444";

export function MonthlySummaryChart({ data }: MonthlySummaryProps) {
  const t = useTranslations("ACCOUNTS");
  const monthsT = useTranslations("MONTHS");

  const revenue = data.totalRevenue || 0;
  const expense = data.totalExpense || 0;
  const isPositive = revenue - expense >= 0;

  const pieData = [
    { name: t("INCOME"), value: revenue },
    { name: t("EXPENSE"), value: expense },
  ];

  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-gray-100 px-4 py-5 transition-colors hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/30">
      <p className="text-sm font-semibold capitalize tracking-tight text-foreground">
        {formatDate(data.month, monthsT)}
      </p>

      <div className="relative size-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={INCOME_COLOR} />
              <Cell fill={EXPENSE_COLOR} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("TOTAL")}
          </span>
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              isPositive
                ? "text-success-600 dark:text-success-400"
                : "text-red-500 dark:text-red-400"
            )}
          >
            {data.profitFormated}
          </span>
        </div>
      </div>

      <div className="w-full space-y-1.5 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: INCOME_COLOR }}
            />
            {t("INCOME")}
          </span>
          <span className="font-semibold tabular-nums text-foreground">
            {data.totalRevenueFormated}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: EXPENSE_COLOR }}
            />
            {t("EXPENSE")}
          </span>
          <span className="font-semibold tabular-nums text-foreground">
            {data.totalExpenseFormated}
          </span>
        </div>
      </div>
    </div>
  );
}
