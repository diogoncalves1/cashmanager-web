"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import { ConversionResult, CurrencyInfo, CurrencySelector, formatConverted } from "../..";
import { Currency } from "@/shared/types/currency";
import { useTranslations } from "next-intl";
import CurrencySwapButton from "../form/CurrencySwapButton";
import ConverterLoading from "../state/ConverterLoading";

interface ConverterCardProps {
  fromInfo?: CurrencyInfo | null;
  toInfo?: CurrencyInfo | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  convert: (presetAmount?: number | null) => void;
  error: string | null;
  isLoadingCurrencies: boolean;
  currencies: Currency[];
  fromCurrency: Currency;
  setFromCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  toCurrency: Currency;
  setToCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  swapCurrencies: () => void;
  result: ConversionResult | null;
  isConverting: boolean;
}

const ConverterCard = ({
  fromInfo,
  toInfo,
  inputRef,
  amount,
  setAmount,
  setError,
  convert,
  error,
  isLoadingCurrencies,
  currencies,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  swapCurrencies,
  result,
  isConverting,
}: ConverterCardProps) => {
  const t = useTranslations("CONVERTER");

  const handleCurrencyChange =
    (setter: React.Dispatch<React.SetStateAction<Currency>>, fallback: Currency) =>
    (code: string) => {
      setter(currencies.find((c) => c.code === code) ?? fallback);
      setError(null);
    };

  return (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="p-0">
        {/* Amount Input */}
        <div className="p-6 pb-4">
          <label
            htmlFor="amount"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {t("AMOUNT")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
              {fromInfo?.symbol}
            </span>
            <Input
              ref={inputRef}
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") convert(null);
              }}
              placeholder="0.00"
              className={cn(
                "h-16 rounded-xl border-border/50 bg-secondary/30 pl-15 text-2xl font-bold tabular-nums",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all",
                error && "border-destructive/50 focus-visible:ring-destructive/20"
              )}
              min="0"
              step="any"
            />
          </div>
        </div>

        {/* Currency Selectors */}
        <div className="relative px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
            {isLoadingCurrencies ? (
              <ConverterLoading />
            ) : (
              <CurrencySelector
                currencies={currencies}
                value={fromCurrency.code ?? ""}
                onValueChange={handleCurrencyChange(setFromCurrency, fromCurrency)}
                label={t("FROM")}
              />
            )}

            <CurrencySwapButton swapCurrencies={swapCurrencies} />

            {isLoadingCurrencies ? (
              <ConverterLoading />
            ) : (
              <CurrencySelector
                currencies={currencies}
                value={toCurrency.code ?? ""}
                onValueChange={handleCurrencyChange(setToCurrency, toCurrency)}
                label={t("TO")}
              />
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Convert Button */}
        <div className="border-t bg-secondary/20 px-6 py-4">
          <Button
            className="h-12 w-full rounded-xl text-base font-semibold transition-all active:scale-[0.98]"
            onClick={() => convert(null)}
            disabled={isConverting}
          >
            {isConverting ? (
              <>
                <RefreshCw className="mr-2 size-4 animate-spin" />
                {t("CONVERTING")}
              </>
            ) : (
              t("CONVERT")
            )}
          </Button>
        </div>

        {/* Result */}
        {result && !error && (
          <div className="border-t bg-primary/5 px-6 py-8 text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              {formatConverted(currencies, result.amount, result.from)} {result.from} =
            </p>
            <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {toInfo?.symbol}
              {formatConverted(currencies, result.result, result.to)}
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">{result.to}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
              <TrendingUp className="size-3.5" />1 {result.from} = {result.rate.toFixed(4)}{" "}
              {result.to}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConverterCard;
