import { InvitationType } from "@/types/invitation";
import { clsx, type ClassValue } from "clsx";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isInviteType(value: string): value is InvitationType {
  return ["debts", "financial-goals", "accounts"].includes(value);
}

export function formatDate(dateString: string, t: ReturnType<typeof useTranslations>): string {
  const [year, month, day] = dateString.split("-");

  const MONTHS: { [key: number]: string } = {
    0: t("JAN"),
    1: t("FEB"),
    2: t("MAR"),
    3: t("APR"),
    4: t("MAY"),
    5: t("JUN"),
    6: t("JUL"),
    7: t("AUG"),
    8: t("SEP"),
    9: t("OCT"),
    10: t("NOV"),
    11: t("DEC"),
  };

  if (day) return `${day} ${MONTHS[parseInt(month) - 1]} ${year}`;
  if (month) return `${MONTHS[parseInt(month) - 1]} ${year}`;
  return year;
}

export function getUserInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function formatCurrency(
  amount: number,
  example: string = "",
  addSymbol: boolean = true,
  decimals: number = 2
): string {
  const [number, symbol] = example.split(" ");
  let unit = "";

  if (amount == undefined) return `$0.00 ${unit} ${symbol} `;

  if (addSymbol) {
    if (amount >= 1000 || amount <= -1000) {
      amount = amount / 1000;
      unit = "k";
    }
    if (amount >= 1000 || amount <= -1000) {
      amount = amount / 10000;
      unit = "M";
    }
    if (amount >= 1000 || amount <= -1000) {
      amount = amount / 1000;
      unit = "B";
    }
  }

  return Number.isNaN(Number(number.replace(",", "")))
    ? `${number.replace(",", "")} ${unit} ${amount.toFixed(decimals)} `
    : `${amount.toFixed(decimals)} ${unit} ${symbol} `;
}

const userColors = [
  "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  "bg-accent/15 text-accent-400 ring-accent-500/20",
  "bg-violet-500/15 text-violet-400 ring-violet-500/20",
  "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  "bg-rose-500/15 text-rose-400 ring-rose-500/20",
  "bg-cyan-500/15 text-cyan-400 ring-cyan-500/20",
];

export function getUserColor(name?: string): string {
  if (!name) return userColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return userColors[Math.abs(hash) % userColors.length];
}
