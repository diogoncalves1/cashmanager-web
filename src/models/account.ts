import { useTranslations } from "next-intl";
import { Currency } from "./currency";
import { User } from "./user";

export type AccountType = "bank_account" | "cash" | "credit_card" | "digital_wallet";

export type ActionsType = {
  view: boolean;
  edit: boolean;
  manage: boolean;
  destroy: boolean;
  createTransactions?: boolean;
};

export const getAccountTypes = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "bank_account",
    label: t("BANK_ACCOUNT"),
  },
  {
    value: "cash",
    label: t("CASH"),
  },
  {
    value: "digital_wallet",
    label: t("DIGITAL_WALLET"),
  },
  {
    value: "credit_card",
    label: t("CREDIT_CARD"),
  },
];
export const getAccountStatus = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "active",
    label: t("ACTIVE"),
  },
  {
    value: "inactive",
    label: t("INACTIVE"),
  },
];

export interface Account {
  id: string;
  name: string;
  totalRevenues?: string;
  totalExpenses?: string;
  balance: number;
  balanceFormated?: string;
  balanceFormatedWithoutSymbol?: string;
  active: boolean;
  status: boolean;
  statusTranslated?: string;
  type: AccountType;
  typeTranslated?: string;
  users?: Array<User>;
  totalTransactions: number;
  actions?: ActionsType;
  currencyCode?: string;
  currencySymbol: string;
  currency?: Currency;
  createdAt?: string;
}

export interface AccountBasic {
  id: string;
  name: string;
  type: string;
}
