import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, t: any): string {
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

  return `${day} ${MONTHS[parseInt(month) - 1]} ${year}`;
}
