type Actions = {
  view: boolean;
  edit: boolean;
  destroy: boolean;
  confirm: boolean;
};

export type DebtPaymentStatus = "pending" | "completed";

export interface DebtPayment {
  id: string;
  debtName: string;
  userName: string;

  amount: string;
  amountFormated: string;

  status: DebtPaymentStatus;
  statusTranslated: string;

  date: string;
  actions: Actions;
  interestRate: number;

  isMonthlyPayment: boolean;

  description: string;
}
