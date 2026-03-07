export type DebtStatus = "active" | "completed" | "paused" | "overdue";
export type PaymentStatus = "pending" | "completed" | "failed";
export type Currency = "USD" | "EUR" | "GBP" | "CAD";

export interface DebtUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "contributor";
  contribution: number;
}

export interface Payment {
  id: string;
  debtId: string;
  amount: number;
  currency: Currency;
  date: string;
  description?: string;
  interestRate?: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface DebtFormData {
  name: string;
  description?: string;
  totalAmount: number;
  currency: Currency;
  monthlyAmount: number;
  interestRate?: number;
  startDate: string;
  dueDate: string;
}

export interface PaymentFormData {
  amount: number;
  date: string;
  description?: string;
  interestRate?: number;
  status: PaymentStatus;
}

// Account types
export type AccountType = "bank" | "cash" | "credit_card" | "savings" | "investment";
export type TransactionStatus = "pending" | "completed" | "failed";
export type TransactionType = "income" | "expense" | "transfer";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  isActive: boolean;
  description?: string;
  participants?: AccountParticipant[];
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  date: string;
  description: string;
  category?: string;
  status: TransactionStatus;
  user?: string;
  createdAt: string;
}

export interface AccountParticipant {
  firstName: string;
  lastName: string;
}

export interface AccountFormData {
  name: string;
  type: AccountType;
  currency: Currency;
  isActive: boolean;
}

export interface TransactionFormData {
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
  category?: string;
  status: TransactionStatus;
}

// Invitation types
export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired";
export type InvitationRole = "participant" | "view_only";
export type InvitationDirection = "sent" | "received";

// Friends / Social types

export type OnlineStatus = "online" | "offline" | "away";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  onlineStatus: OnlineStatus;
}

export interface FriendSearchResult {
  user: UserProfile;
  isFriend: boolean;
  isPending: boolean;
  isBlocked: boolean;
}
