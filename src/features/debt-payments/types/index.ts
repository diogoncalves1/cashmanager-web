import { useTranslations } from "next-intl";

type Actions = {
  view: boolean;
  edit: boolean;
  destroy: boolean;
  confirm: boolean;
};

export type DebtPaymentStatus = "pending" | "completed";

export const debtPaymentStatus = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "completed",
    label: t("COMPLETED"),
  },
  {
    value: "pending",
    label: t("PENDING"),
  },
];

export interface DebtPayment {
  id: string;
  debtName: string;
  userName: string;

  amount: string;
  amountFormated: string;

  debtId: string;

  status: DebtPaymentStatus;
  statusTranslated: string;

  date: string;
  actions: Actions;
  interestRate: number;

  isMonthlyPayment: boolean;
  interestPaidFormated: string;
  interestPaid: number;

  description: string;
}

export type MyPagination = {
  pageIndex: number;
  pageSize: number;
};
