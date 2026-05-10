import { User } from "@/shared/types/user";
import { Account } from "@/features/accounts";
import { Debt } from "@/features/debts";
import { FinancialGoal } from "@/features/financial-goals";

export type ActivityTypeTypes = Account | Debt | FinancialGoal;
export type ActivityType = "accounts" | "debts" | "financial-goals";

export interface Activity {
  title: string;
  message: string;
  user: User;
  createdAt: string;
}
