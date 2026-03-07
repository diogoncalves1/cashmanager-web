export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(dateString));
}

export function getProgressPercentage(paid: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((paid / total) * 100);
}

// Aggregate all transactions across all accounts
export interface TransactionWithAccount {
  transaction: import("./types").Transaction;
  accountName: string;
  accountId: string;
}
