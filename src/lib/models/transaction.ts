import { icons } from "lucide-react";
import { AccountType } from "./account";
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
    value: "completed",
    label: "Completed",
  },
  {
    value: "pending",
    label: "Pending",
  },
];

export type Actions = {
  confirm: boolean;
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
  categoryIcon?: keyof typeof icons;
  accountTypeTranslated: string;
  accountType: AccountType;
  categoryColor?: string;
  actions: Actions;
}
