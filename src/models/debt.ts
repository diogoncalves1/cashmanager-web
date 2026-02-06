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
  startDate: string;
  status: DebtStatus;
  statusTranslated: string;

  monthsPaid: number;
  months: number;
  interestRate: number;
  monthlyAmount: number;

  description: string;

  currencyCode: string;
  currencyId: string;

  users: User[];
  actions: DebtActions;
}

export interface DebtBasic {
  id: string;
  name: string;
  current: number;
  currentFormated: string;
  monthlyAmount: number;
  target: number;
  targetFormated: string;
  currencySymbol: string;
  interestRate: number;
}
