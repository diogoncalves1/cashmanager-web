import { FinancialGoal } from "@/lib/models/financialGoal";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Target } from "lucide-react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";

export function FinancialGoalHeader({ financialGoal }: { financialGoal?: FinancialGoal }) {
  const t = useTranslations("FINANCIAL_GOALS");

  if (!financialGoal) return <></>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Target size={26} />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">{financialGoal.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={financialGoal.status} />
              <PriorityBadge priority={financialGoal.priority} />
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  (financialGoal.description as string).length > 40
                    ? (financialGoal.description as string)?.slice(0, 40).concat("...")
                    : (financialGoal.description as string) || "<i>No description provided</i>",
              }}
            />
          </div>

          <div className="flex gap-3">
            {financialGoal.actions?.createTransactions && (
              <Link
                href={`/financial-goal-transactions/create`}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
              >
                {t("ADD_TRANSACTION")}
              </Link>
            )}
            {financialGoal.actions?.edit && (
              <Link
                href={`/financial-goals/${financialGoal.id}/edit`}
                className="rounded-xl border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {t("EDIT")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
