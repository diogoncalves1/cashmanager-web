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
  userName?: string;
  amountFormated: string;

  status: string;
  statusTranslated: string;

  type: string;
  typeTranslated: string;

  actions: Actions;
}
