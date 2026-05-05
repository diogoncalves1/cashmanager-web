import { Account } from "@/types/account";
import { Debt } from "@/types/debt";
import { FinancialGoal } from "./financialGoal";
import { SharedRole } from "@/types/sharedRole";
import { User } from "@/types/user";

// Invitation types
export type InvitationStatus = "pending" | "accepted" | "revoked";
export type InvitationRole = "participant" | "view_only";
export type InvitationDirection = "sent" | "received";

export type InvitationType = "accounts" | "debts" | "financial-goals";

export interface Invitation {
  id: string;
  sender: User;
  receiver: User;

  role: InvitationRole;
  sharedRole?: SharedRole;

  subject: FinancialGoal | Debt | Account;
  status: InvitationStatus;
  statusTranslated: string;
  createdAt: string;
}

export interface InvitationFormData {
  recipientEmail: string;
  subject: string;
  role: InvitationRole;
  sharedRole: InvitationRole;
}
