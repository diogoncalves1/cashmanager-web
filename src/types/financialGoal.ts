import { useTranslations } from "next-intl";
import { Currency } from "@/types/currency";
import { SharedRole } from "@/types/sharedRole";

export const getFinancialGoalStatus = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "completed",
    label: t("COMPLETED"),
  },
  {
    value: "in_progress",
    label: t("IN_PROGRESS"),
  },
  {
    value: "canceled",
    label: t("CANCELED"),
  },
];

export const getFinancialGoalPriorities = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "low",
    label: t("LOW"),
    color: "bg-muted-foreground",
  },
  {
    value: "medium",
    label: t("MEDIUM"),
    color: "bg-chart-3",
  },
  {
    value: "high",
    label: t("HIGH"),
    color: "bg-destructive",
  },
];

export type FinancialGoalStatus = "completed" | "in_progress" | "canceled";
export type FinancialGoalPriority = "low" | "medium" | "high";

export type FinancialGoalActions = {
  view: boolean;
  edit: boolean;
  destroy: boolean;
  manage: boolean;
  markCompleted: boolean;
  createTransactions: boolean;
};

export const prioritiesColors: Record<FinancialGoalPriority, string> = {
  low: "success",
  medium: "warning",
  high: "error",
};
export const statusColors: Record<FinancialGoalStatus, string> = {
  completed: "success",
  in_progress: "warning",
  canceled: "error",
};

export interface UserContribution {
  id: string;
  name: string;
  email?: string;
  sharedRole?: SharedRole;
  contribution: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  currencyId: string;
  currencyCode: string;
  currency?: Currency;

  percentageCompleted: number;

  totalAmount: number;
  totalAmountFormated: string;
  totalAmountFormatedWithoutSymbol: string;

  contributedAmount: number;
  contributedAmountFormated: string;
  contributedAmountFormatedWithoutSymbol: string;

  missingAmount: number;
  missingAmountFormated: string;

  averageTransactionValue?: number;
  averageTransactionValueFormated?: string;

  totalContributions: number;
  totalContributionsFormated: number;

  totalWithdrawals: number;
  totalWithdrawalsFormated: number;

  startDate: string;
  dueDate: string;
  status: FinancialGoalStatus;
  totalTransactions?: number;
  statusTranslated: string;
  description?: string;
  completedAt?: string;
  priority: FinancialGoalPriority;
  priorityTranslated?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;

  users?: UserContribution[];
  actions?: FinancialGoalActions;
}

export interface FinancialGoalBasic {
  id: string;
  name: string;
  current: number;
  currentFormated: string;
  target: number;
  targetFormated: string;
  currencySymbol: string;
}
