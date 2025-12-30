import { Category } from "./category";
import { User } from "./user";

export type TransactionType = "revenue" | "expense";

export const transactionTypes = [
  {
    value: "revenue",
    label: "Revenue",
  },
  {
    value: "expense",
    label: "Expense",
  },
];

export const transactionStatus = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export type Actions = {
  view: boolean;
  edit: boolean;
  destroy: boolean;
};

export type TransactionStatus = "pending" | "completed";

export interface Transaction {
  id: string;
  accountId: number;
  type: TransactionType;
  typeTranslated?: string;
  amount: number;
  amountFormated: string;
  date: string;
  description: string;
  status: TransactionStatus;
  statusTranslated?: string;
  userId?: number;
  user?: User;
  userName?: string;
  accountName?: string;
  currencySymbol?: string;
  currencyCode?: string;
  category?: Category;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  actions: Actions;
}
