export interface MonthlyDataItem {
  balance: number;
  monthYear: string;
  revenues?: number;
  expenses?: number;
}

export type Period = "3m" | "ytd" | "12m" | "all";

export type MonthMap = { [key: number]: string };
