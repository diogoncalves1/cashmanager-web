import { useTranslations } from "next-intl";
import LineChartLoading from "@/components/charts/line/LineChartLoading";

export function MonthlyBalanceChartLoading() {
  const t = useTranslations("HOME");

  return (
    <div className="col-span-12 xl:col-span-9">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("MONTHLY_BALANCE")}
          </h3>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-full xl:min-w-full pl-2">
            <LineChartLoading height={485} />
          </div>
        </div>
      </div>
    </div>
  );
}
