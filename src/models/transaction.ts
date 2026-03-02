import { useTranslations } from "next-intl";
import { AccountType } from "./account";
import { Category, IconName } from "./category";
import { User } from "./user";

export type TransactionType = "revenue" | "expense";

export const getTransactionTypes = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "revenue",
    label: t("INCOME"),
  },
  {
    value: "expense",
    label: t("EXPENSE"),
  },
];

export const getTransactionStatus = (t: ReturnType<typeof useTranslations>) => [
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
  categoryIcon?: IconName;
  accountTypeTranslated: string;
  accountType: AccountType;
  categoryColor?: string;
  actions: Actions;
}
