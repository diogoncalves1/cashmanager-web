import { DebtStatus } from "@/models/debt";

export default function StatusBadge({
  status,
  translate,
}: {
  status: DebtStatus;
  translate?: string;
}) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          color: "success",
        };
      case "in_progress":
        return {
          color: "warning",
        };
      default:
        return {
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

  const statusInfo = getStatusInfo(status);
  const colorClasses = colorMap[statusInfo.color] || colorMap["warning"];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${colorClasses.bg} px-3 py-1 text-xs font-medium ${colorClasses.text} ring-1 ${colorClasses.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colorClasses.bgText}`} />
      {translate}
    </span>
  );
}
