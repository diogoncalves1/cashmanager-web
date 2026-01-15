import ProgressBar from "@/components/ui/ProgressBar";
import { FinancialGoal } from "@/lib/models/financialGoal";
import { DollarSign, Target, TrendingUp, TrendingDown, CheckCircle2, Award } from "lucide-react";
import { useTranslations } from "next-intl";
import StatCard from "../StatCard";
import StatusBadge from "../StatusBadge";

type Props = {
  financialGoal?: FinancialGoal;
};

export default function FinancialGoalProgress({ financialGoal }: Props) {
  if (!financialGoal) return null;
  const t = useTranslations("FINANCIAL_GOALS");

  const isCompleted =
    financialGoal.status === "completed" ||
    financialGoal.contributedAmount >= financialGoal.totalAmount;

  const progress = financialGoal.percentageCompleted;
  const showCelebration = financialGoal.status === "completed";

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-2xl p-6 shadow-lg border border-gray-100/80 overflow-hidden relative">
      {showCelebration && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
      )}

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">{t("GOAL_PROGRESS")}</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {financialGoal.contributedAmountFormatedWithoutSymbol} {t("OF")}{" "}
            {financialGoal.totalAmountFormatedWithoutSymbol}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-extrabold ${
                isCompleted ? "text-emerald-600" : "text-blue-600"
              }`}
            >
              {progress.toFixed(2)}
            </span>
            <span className="text-lg font-semibold text-gray-400">%</span>
          </div>

          {showCelebration ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100 shadow-sm">
              <Award className="w-4 h-4" />
              <span>{t("GOAL_COMPLETED")}</span>
            </div>
          ) : (
            <StatusBadge status={financialGoal.status} />
          )}
        </div>
      </div>

      <ProgressBar isCompleted={isCompleted} progress={progress} />

      <div
        className={`grid ${
          isCompleted ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"
        } gap-4 relative z-10`}
      >
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
          label={t("COLLECTED_AMOUNT")}
          value={financialGoal.contributedAmountFormatedWithoutSymbol}
          isHighlight={isCompleted}
        />

        {!isCompleted && (
          <StatCard
            icon={<Target className="w-5 h-5" />}
            color="amber"
            label={t("MISSING_AMOUNT")}
            value={financialGoal.missingAmountFormated}
          />
        )}

        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          label={t("CONTRIBUTIONS")}
          value={`+ ${financialGoal.totalContributionsFormated}`}
        />

        <StatCard
          icon={<TrendingDown className="w-5 h-5" />}
          color="rose"
          label={t("WITHDRAWALS")}
          value={`- ${financialGoal.totalWithdrawalsFormated}`}
        />
      </div>

      {showCelebration && (
        <div className="mt-6 text-center text-sm text-emerald-600/80 font-medium flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {t("GOAL_COMPLETED_MESSAGE")}
        </div>
      )}
    </div>
  );
}
