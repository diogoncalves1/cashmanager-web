import { BadgeColor } from "@/components/ui/badge/Badge";
import { Currency } from "./currency";
import { SharedRole } from "./sharedRole";

export const getFinancialGoalStatus = (t: any) => [
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

export const getFinancialGoalPriorities = (t: any) => [
  {
    value: "low",
    label: t("LOW"),
  },
  {
    value: "medium",
    label: t("MEDIUM"),
  },
  {
    value: "high",
    label: t("HIGH"),
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

export const prioritiesColors: Record<FinancialGoalPriority, BadgeColor> = {
  low: "success",
  medium: "warning",
  high: "error",
};
export const statusColors: Record<FinancialGoalStatus, BadgeColor> = {
  completed: "success",
  in_progress: "warning",
  canceled: "error",
};

interface UserContribution {
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
