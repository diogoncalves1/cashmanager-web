import LineChartLoading from "@/components/charts/line/LineChartLoading";
import { useTranslations } from "next-intl";

export function CashFlowChartLoading({ heigth }: { heigth: number }) {
  const t = useTranslations("HOME");
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("CASH_FLOW_CHART_TITLE")}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {t("CASH_FLOW_CHART_DESCRIPTION")}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end"></div>
      </div>
      <LineChartLoading height={heigth} />
    </div>
  );
}
