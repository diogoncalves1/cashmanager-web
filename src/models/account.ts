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

export const accountTypes = [
  {
    value: "bank_account",
    label: "Conta Bancária",
  },
  {
    value: "cash",
    label: "Dinheiro",
  },
  {
    value: "digital_wallet",
    label: "Carteira Digital",
  },
  {
    value: "credit_card",
    label: "Cartão de Crédito",
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
