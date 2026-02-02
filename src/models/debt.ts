import { User } from "./user";
import { BadgeColor } from "@/components/ui/badge";

export type DebtStatus = "pending" | "paid";

export type DebtActions = {
  view: boolean;
  edit: boolean;
  destroy: boolean;
  manage: boolean;
  markPaid: boolean;
  createTransactions: boolean;
};

export const getDebtStatus = (t: any) => [
  {
    value: "completed",
    label: t("COMPLETED"),
  },
  {
    value: "pending",
    label: t("PENDING"),
  },
];

export const statusColors: Record<DebtStatus, BadgeColor> = {
  paid: "success",
  pending: "warning",
};

export interface Debt {
  id: string;
  name: string;
  paidAmount: number;
  paidAmountFormated: string;
  totalAmount: number;
  totalAmountFormated: string;
  dueDate: string;
  status: DebtStatus;
  statusTranslated: string;

  users: User[];
  actions: DebtActions;
}
