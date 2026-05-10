import { formatDate } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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

const INCOME_COLOR = "#10b981";
const EXPENSE_COLOR = "#ef4444";

export function MonthlySummaryChart({ data }: MonthlySummaryProps) {
  const t = useTranslations("ACCOUNTS");
  const monthsT = useTranslations("MONTHS");

  const revenue = data.totalRevenue || 0;
  const expense = data.totalExpense || 0;

  const pieData = [
    { name: t("INCOME"), value: revenue },
    { name: t("EXPENSE"), value: expense },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-28 sm:size-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="85%"
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={INCOME_COLOR} />
              <Cell fill={EXPENSE_COLOR} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-muted-foreground capitalize">{t("TOTAL")}</span>
          <span className="text-xs font-bold text-foreground sm:text-sm">
            {data.profitFormated}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground">{formatDate(data.month, monthsT)}</p>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[13px]" style={{ color: INCOME_COLOR }}>
          {t("INCOME")}: {data.totalRevenueFormated}
        </span>
        <span className="text-[13px]" style={{ color: EXPENSE_COLOR }}>
          {t("EXPENSE")}: {data.totalExpenseFormated}
        </span>
      </div>
    </div>
  );
}
