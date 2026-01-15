import { FinancialGoalPriority } from "@/lib/models/financialGoal";
import { useTranslations } from "next-intl";

export default function PriorityBadge({ priority }: { priority: FinancialGoalPriority }) {
  const t = useTranslations("FINANCIAL_GOALS");

  const getPriorityInfo = (priority: FinancialGoalPriority) => {
    switch (priority) {
      case "high":
        return {
          text: t("HIGH"),
          color: "error",
        };
      case "medium":
        return {
          text: t("MEDIUM"),
          color: "warning",
        };
      case "low":
        return {
          text: t("LOW"),
          color: "success",
        };
      default:
        return {
          text: t("MEDIUM"),
          color: "warning",
        };
    }
  };
  const colorMap: Record<
    string,
    {
      bg: string;
      text: string;
      ring: string;
      bgText: string;
    }
  > = {
    error: {
      bg: "bg-error-50",
      text: "text-error-700",
      ring: "ring-error-200",
      bgText: "bg-error-500",
    },
    success: {
      bg: "bg-success-50",
      text: "text-success-700",
      ring: "ring-success-200",
      bgText: "bg-success-500",
    },
    warning: {
      bg: "bg-warning-50",
      text: "text-warning-700",
      ring: "ring-warning-200",
      bgText: "bg-warning-500",
    },
  };
  const priorityInfo = getPriorityInfo(priority);

  const colorClasses = colorMap[priorityInfo.color] || colorMap["warning"]; // fallback

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${colorClasses.bg} px-3 py-1 text-xs font-medium ${colorClasses.text} ring-1 ${colorClasses.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colorClasses.bgText}`} />
      {priorityInfo?.text}
    </span>
  );
}
