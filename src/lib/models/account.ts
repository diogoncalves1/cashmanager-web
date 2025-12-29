import { User } from "./user";

export type AccountType = "bank_account" | "cash" | "credit_card" | "digital_wallet";

export type Actions = {
  edit: boolean;
  destroy: boolean;
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
  id: number;
  name: string;
  active: boolean;
  balance: number;
  type: AccountType;
  typeTranslated?: string;
  users?: Array<User>;
  actions?: Actions;
}
