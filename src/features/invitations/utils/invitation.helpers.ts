import { InvitationType } from "../types";

export function isInviteType(value: string): value is InvitationType {
  return ["debts", "financial-goals", "accounts"].includes(value);
}
