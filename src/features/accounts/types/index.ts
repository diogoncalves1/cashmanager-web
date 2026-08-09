import { useTranslations } from "next-intl";
import { Currency } from "@/shared/types/currency";
import { User } from "@/shared/types/user";
import { CreditCard, Landmark, LineChart, Wallet, Building2, Smartphone } from "lucide-react";

export interface AccountFiltersType {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export type Stats = {
  activeAccounts?: number;
  netWorth?: string;
  totalRevenues?: string;
  totalExpenses?: string;
};

export interface ApiResponse<T> {
  data: T[];
  recordsFiltered: number;
  page: number;
  pageSize: number;
  stats: Stats;
}

export type AccountType = "bank_account" | "cash" | "credit_card" | "digital_wallet";

export type ActionsType = {
  view: boolean;
  edit: boolean;
  manage: boolean;
  destroy: boolean;
  createTransactions?: boolean;
};

export interface AccountFormData {
  name: string;
  type: AccountType;
  currency: Currency;
  isActive: boolean;
}

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
  invites?: Array<User>;
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
  typeOrg: AccountType;
}

export const accountTypeIcons: Record<AccountType, React.ComponentType<{ className?: string }>> = {
  bank_account: Landmark,
  cash: Wallet,
  credit_card: CreditCard,
  digital_wallet: LineChart,
};

export const accountTypeConfig: Record<
  AccountType,
  {
    icon: typeof Building2;
    className: string;
    iconClassName: string;
    ringClassName: string;
    bg: string;
    text: string;
  }
> = {
  bank_account: {
    icon: Building2,
    className: "bg-blue-50 text-blue-600 dark:bg-blue-900/15 dark:text-blue-400",
    iconClassName:
      "bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-600 dark:from-blue-400/15 dark:to-blue-400/5 dark:text-blue-400",
    ringClassName: "ring-blue-500/10 dark:ring-blue-400/10",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  cash: {
    icon: Wallet,
    className: "bg-success-50 text-accent dark:bg-success-900/15 dark:text-accent",
    iconClassName:
      "bg-gradient-to-br from-accent/15 to-accent/5 text-accent dark:from-accent/15 dark:to-accent/5 dark:text-accent",
    ringClassName: "ring-accent/10 dark:ring-accent/10",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  credit_card: {
    icon: CreditCard,
    className: "bg-orange-50 text-orange-600 dark:bg-orange-900/15 dark:text-orange-400",
    iconClassName:
      "bg-gradient-to-br from-orange-500/15 to-orange-500/5 text-orange-600 dark:from-orange-400/15 dark:to-orange-400/5 dark:text-orange-400",
    ringClassName: "ring-orange-500/10 dark:ring-orange-400/10",
    bg: "bg-orange-500/10",
    text: "text-orange-500",
  },
  digital_wallet: {
    icon: Smartphone,
    className: "bg-purple-50 text-purple-600 dark:bg-purple-900/15 dark:text-purple-400",
    iconClassName:
      "bg-gradient-to-br from-purple-500/15 to-purple-500/5 text-purple-600 dark:from-purple-400/15 dark:to-purple-400/5 dark:text-purple-400",
    ringClassName: "ring-purple-500/10 dark:ring-purple-400/10",
    bg: "bg-violet-500/10",
    text: "text-violet-500",
  },
};
