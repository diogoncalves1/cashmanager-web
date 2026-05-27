import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { convertCurrency } from "../../utils/converter.helpers";
import { Currency } from "@/shared/types/currency";
import { cn } from "@/shared/utils";
import { useTranslations } from "next-intl";

const PopularPairsCard = ({
  currencies,
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
  setError,
}: {
  currencies: Currency[];
  fromCurrency: Currency;
  toCurrency: Currency;
  setFromCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  setToCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const t = useTranslations("CONVERTER");

  const popularPairs = [
    { from: "USD", to: "EUR" },
    { from: "EUR", to: "GBP" },
    { from: "USD", to: "JPY" },
    { from: "GBP", to: "USD" },
    { from: "USD", to: "BRL" },
  ];

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("POPULAR_PAIRS")}
        </h3>
        <div className="space-y-2">
          {popularPairs.map((pair) => {
            const { rate } = convertCurrency(
              1,
              currencies.find((c) => c.code == pair.from) || fromCurrency,
              currencies.find((c) => c.code == pair.to) || toCurrency
            );
            return (
              <button
                key={`${pair.from}-${pair.to}`}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary/50",
                  fromCurrency.code === pair.from && toCurrency.code === pair.to && "bg-primary/10"
                )}
                onClick={() => {
                  setFromCurrency(currencies.find((c) => c.code === pair.from) || fromCurrency);
                  setToCurrency(currencies.find((c) => c.code === pair.to) || toCurrency);
                  setError(null);
                }}
              >
                <span className="font-medium">
                  {pair.from}/{pair.to}
                </span>
                <span className=" text-xs text-muted-foreground">{rate.toFixed(4)}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularPairsCard;
