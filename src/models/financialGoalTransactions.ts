export const financialGoalTransactionTypes = (t: any) => [
  {
    value: "contribution",
    label: t("CONTRIBUTION"),
  },
  {
    value: "withdrawal",
    label: t("WITHDRAWAL"),
  },
];

export type FinancialGoalTransactionType = "contribution" | "withdrawal";
export type FinancialGoalTransactionStatus = "completed" | "pending";

export const financialGoalTransactionStatus = (t: any) => [
  {
    value: "completed",
    label: t("COMPLETED"),
  },
  {
    value: "pending",
    label: t("PENDING"),
  },
];

export type Actions = {
  confirm: boolean;
  view: boolean;
  edit: boolean;
  destroy: boolean;
};

export interface FinancialGoalTransaction {
  id: string;

  financialGoalId: string;
  financialGoalName: string;
  date: string;
  amount: string;
  transactionId: string;
  description: string;
  userName: string;
  amountFormated: string;

  status: FinancialGoalTransactionStatus;
  statusTranslated: string;

  type: FinancialGoalTransactionType;
  typeTranslated: string;

  accountName: string;
  accountType: string;

  sharedRole: string;

  balanceBefore?: string;
  balanceAfter?: string;

  actions: Actions;
}
