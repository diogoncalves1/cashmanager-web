import { FinancialGoal } from "@/lib/models/financialGoal";
import { FinancialGoalHeader } from "./FinancialGoalHeader";
import FinancialGoalProgress from "./FinancialGoalProgress";
import { FinancialGoalTransaction } from "@/lib/models/financialGoalTransactions";
import StatusBadge from "../StatusBadge";
import { useTranslations } from "next-intl";
import PriorityBadge from "../PriorityBadge";

type Props = {
  financialGoal?: FinancialGoal;
  recentTransaction: FinancialGoalTransaction[];
};

export default function FinancialGoalOverview({ financialGoal, recentTransaction }: Props) {
  const t = useTranslations("FINANCIAL_GOALS");
  if (!financialGoal) return <></>;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <FinancialGoalHeader financialGoal={financialGoal} />

      {/* Progresso */}
      <FinancialGoalProgress financialGoal={financialGoal} />

      {/* Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: t("TRANSACTIONS"), value: financialGoal.totalTransactions },
              { label: t("USERS"), value: financialGoal.users?.length },
              {
                label: t("CREATED_AT"),
                value: financialGoal.createdAt,
              },
            ].map((m) => (
              <div
                key={m.label}
                className="
                              rounded-2xl border bg-white p-6 shadow-sm
                              transition-all duration-200
                              hover:-translate-y-1 hover:shadow-lg
                            "
              >
                <p className="text-sm text-gray-500">{m.label}</p>
                <p className="mt-2 text-2xl font-semibold">{m.value}</p>
              </div>
            ))}
          </div>
          {recentTransaction.length > 0 && (
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">{t("RECENT_TRANSACTIONS")}</h2>
              </div>

              <div className="divide-y">
                {recentTransaction.map((t) => (
                  <div key={t.id} className="flex justify-between px-6 py-4 hover:bg-gray-50">
                    <span>{t.date}</span>
                    <span>{t.userName}</span>
                    <span
                      className={`font-medium ${
                        t.type == "withdrawal" ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {t.amountFormated}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold">{t("FINANCIAL_GOAL_DETAILS")}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("NAME")}</span>
              <span>{financialGoal.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("START_DATE")}</span>
              <span>{financialGoal.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("DUE_DATE")}</span>
              <span>{financialGoal.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("CURRENCY")}</span>
              <span>{financialGoal.currencyCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t("STATUS")}</span>
              <StatusBadge status={financialGoal.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t("PRIORITY")}</span>
              <PriorityBadge priority={financialGoal.priority} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
