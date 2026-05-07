import { User } from "@/types/user";
import { Account } from "./account";
import { Debt } from "./debt";
import { FinancialGoal } from "./financialGoal";

export type ActivityTypeTypes = Account | Debt | FinancialGoal;
export type ActivityType = "accounts" | "debts" | "financial-goals";

export interface Activity {
  title: string;
  message: string;
  user: User;
  createdAt: string;
}
