import { BadgeColor } from "@/components/ui/badge/Badge";
import { Currency } from "./currency";
import { User } from "./user";

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
  markCompleted: boolean;
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

export interface FinancialGoal {
  id: string;
  name: string;
  currencyId: string;
  currency?: Currency;
  totalAmount: number;
  totalAmountFormated: string;
  contributedAmount: number;
  contributedAmountFormated: string;
  startDate: string;
  dueDate: string;
  status: FinancialGoalStatus;
  statusTranslated: string;
  description?: string;
  completedAt?: string;
  priority?: FinancialGoalPriority;
  priorityTranslated?: string;
  canceled_at?: string;
  users?: User[];
  actions?: FinancialGoalActions;
}
