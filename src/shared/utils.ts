import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { enUS, pt } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { User } from "./types/user";

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

export const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function timeAgo(user: User, date: string): string {
  const locales = {
    pt: pt,
    en: enUS,
  };

  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locales[user.preferences?.lang as keyof typeof locales],
  });
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
  const [number, unitDefault, symbolDefault] = example.split(" ");

  let unit = "";

  if (amount == undefined) return `$0.00 ${unit} ${unitDefault} `;

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

  if (unit == "" && unitDefault) {
    return `${amount.toFixed(decimals)} ${symbolDefault || unitDefault} ${unit}`;
  }

  return Number.isNaN(Number(number.replace(",", "")))
    ? `${number.replace(",", "")} ${unit} ${amount.toFixed(decimals)} `
    : `${amount.toFixed(decimals)} ${unit} ${symbolDefault ?? unitDefault}`;
}

const userColors = [
  "bg-slate-500/15 text-slate-400 ring-slate-500/20",
  "bg-gray-500/15 text-gray-400 ring-gray-500/20",
  "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
  "bg-neutral-500/15 text-neutral-400 ring-neutral-500/20",
  "bg-stone-500/15 text-stone-400 ring-stone-500/20",
  "bg-red-500/15 text-red-400 ring-red-500/20",
  "bg-orange-500/15 text-orange-400 ring-orange-500/20",
  "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  "bg-yellow-500/15 text-yellow-400 ring-yellow-500/20",
  "bg-lime-500/15 text-lime-400 ring-lime-500/20",
  "bg-green-500/15 text-green-400 ring-green-500/20",
  "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  "bg-teal-500/15 text-teal-400 ring-teal-500/20",
  "bg-cyan-500/15 text-cyan-400 ring-cyan-500/20",
  "bg-sky-500/15 text-sky-400 ring-sky-500/20",
  "bg-accent/15 text-accent ring-accent/20",
  "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  "bg-indigo-500/15 text-indigo-400 ring-indigo-500/20",
  "bg-violet-500/15 text-violet-400 ring-violet-500/20",
  "bg-purple-500/15 text-purple-400 ring-purple-500/20",
  "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/20",
  "bg-pink-500/15 text-pink-400 ring-pink-500/20",
  "bg-rose-500/15 text-rose-400 ring-rose-500/20",
];

export function getUserColor(name?: string): string {
  if (!name) return userColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return userColors[Math.abs(hash) % userColors.length];
}

export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (!params) return endpoint;
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return query ? `${endpoint}?${query}` : endpoint;
}
