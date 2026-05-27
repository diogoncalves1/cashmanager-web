import { Currency } from "@/shared/types/currency";
import { CurrencyInfo } from "../types";

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): { result: number; rate: number } {
  const fromRate = from.rate;
  const toRate = to.rate;

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency: ${!fromRate ? from : to}`);
  }

  const amountInUSD = amount / fromRate;
  const result = amountInUSD * toRate;
  const rate = toRate / fromRate;

  return { result, rate };
}

export function getCurrencyByCode(currencies: Currency[], code: string): CurrencyInfo | undefined {
  return currencies.find((c) => c.code === code);
}

export function formatConverted(
  currencies: Currency[],
  amount: number,
  currencyCode: string
): string {
  const currency = getCurrencyByCode(currencies, currencyCode);
  if (!currency) return amount.toFixed(2);

  const decimals = ["JPY", "KRW"].includes(currencyCode) ? 0 : 2;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
