import { AppLink } from "@/components/ui/button/AppLink";
import { FinancialGoal } from "@/lib/models/financialGoal";
import {
  onCancelFinancialGoal,
  onDeleteFinancialGoal,
  onMarkPaidFinancialGoal,
  onResetFinancialGoal,
} from "@/services/financial-goals/service";
import { CheckCircle, Edit, RefreshCcw, XCircle, Calendar, FileText, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import StatusBadge from "../StatusBadge";

type Props = {
  financialGoal?: FinancialGoal;
  setStatus: Dispatch<SetStateAction<any>>;
  router: any;
};

export default function FinancialGoalOthers({ financialGoal, setStatus, router }: Props) {
  const t = useTranslations("FINANCIAL_GOALS");
  if (!financialGoal) return null;

  const isCompleted = financialGoal.status === "completed";
  const canComplete = !isCompleted && financialGoal.contributedAmount >= financialGoal.totalAmount;
  const isCanceled = financialGoal.status === "canceled";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t("OTHERS_INFORMATION")}</h3>

        <StatusBadge status={financialGoal.status} />
      </div>

      <div className="space-y-6">
        {/* Descrição */}
        {financialGoal.description && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-medium text-gray-700">{t("DESCRIPTION")}</h4>
            </div>

            <div
              className="text-sm text-gray-600 leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: financialGoal.description,
              }}
            />
          </div>
        )}

        {/* Datas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t("CREATED_AT")}</span>
            </div>
            <p className="text-sm text-gray-900">{financialGoal.createdAt}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t("LAST_UPDATE")}</span>
            </div>
            <p className="text-sm text-gray-900">{financialGoal.updatedAt}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          {canComplete && !isCanceled && (
            <button
              onClick={async function () {
                const res = await onMarkPaidFinancialGoal(financialGoal.id);

                if (res) setStatus("completed");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-600 text-white text-sm font-medium hover:bg-success-700 transition"
            >
              <CheckCircle className="w-4 h-4" />
              {t("COMPLETE")}
            </button>
          )}

          <AppLink
            path={`/financial-goals/${financialGoal.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <Edit className="w-4 h-4" />
            {t("EDIT")}
          </AppLink>

          {(isCompleted || isCanceled) && (
            <button
              onClick={async function () {
                const res = await onResetFinancialGoal(financialGoal.id, t);

                if (res) setStatus("in_progress");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning-500 text-white text-sm font-medium hover:bg-warning-600 transition"
            >
              <RefreshCcw className="w-4 h-4" />
              {t("RESET")}
            </button>
          )}

          {!isCanceled && !isCompleted && (
            <button
              onClick={async function () {
                const res = await onCancelFinancialGoal(financialGoal.id, t);

                if (res) setStatus("canceled");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error-500 text-white text-sm font-medium hover:bg-error-600 transition"
            >
              <XCircle className="w-4 h-4" />
              {t("CANCEL")}
            </button>
          )}

          <button
            onClick={async () => {
              const res = await onDeleteFinancialGoal(financialGoal.id, t);

              res && router.push("/financial-goals");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-error-300 text-error-600 text-sm font-medium hover:bg-error-50 transition ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            {t("DELETE")}
          </button>
        </div>
      </div>
    </div>
  );
}
