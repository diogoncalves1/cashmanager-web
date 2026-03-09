import { useTranslations } from "next-intl";
import { SharedRole } from "./sharedRole";

export type DebtStatus = "pending" | "paid";

export type DebtActions = {
  view: boolean;
  edit: boolean;
  destroy: boolean;
  manage: boolean;
  markPaid: boolean;
  createTransactions: boolean;
};

export const getDebtStatus = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "completed",
    label: t("COMPLETED"),
  },
  {
    value: "pending",
    label: t("PENDING"),
  },
];

export const statusColors: Record<DebtStatus, string> = {
  paid: "success",
  pending: "warning",
};

interface UserPayment {
  id: string;
  name: string;
  email?: string;
  sharedRole?: SharedRole;
  paid: string;
}

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

  remainingAmount: string;

  monthsPaid: number;
  months: number;
  interestRate: number;
  monthlyAmount: number;
  monthlyAmountFormated: string;

  interestPaid: number;
  interestPaidFormated: string;

  description: string;

  currencyCode: string;
  currencyId: string;

  users: UserPayment[];
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
