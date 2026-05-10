import { User } from "@/shared/types/user";
import { Account } from "@/features/accounts/types";
import { Debt } from "@/features/debts/types";
import { FinancialGoal } from "@/features/financial-goals/types";

export type ActivityTypeTypes = Account | Debt | FinancialGoal;
export type ActivityType = "accounts" | "debts" | "financial-goals";

export interface Activity {
  title: string;
  message: string;
  user: User;
  createdAt: string;
}
