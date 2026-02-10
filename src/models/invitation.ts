import { Account } from "./account";
import { Debt } from "./debt";
import { FinancialGoal } from "./financialGoal";
import { SharedRole } from "./sharedRole";
import { User } from "./user";

// Invitation types
export type InvitationStatus = "pending" | "accepted" | "revoked";
export type InvitationRole = "participant" | "view_only";
export type InvitationDirection = "sent" | "received";

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
