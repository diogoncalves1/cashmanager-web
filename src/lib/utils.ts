import { clsx, type ClassValue } from "clsx";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatCurrency(amount: number, example: string, addSymbol: boolean = true): string {
  const [number, symbol] = example.split(" ");
  let unit = "";

  if (!addSymbol) {
    if (amount >= 1000) {
      amount = amount / 1000;
      unit = "k";
    }
    if (amount >= 1000) {
      amount = amount / 10000;
      unit = "M";
    }
    if (amount >= 1000) {
      amount = amount / 1000;
      unit = "B";
    }
  }

  return Number.isNaN(Number(number))
    ? `${symbol} ${amount.toFixed(2)} ${unit}`
    : `${amount.toFixed(2)} ${symbol} `;
}
