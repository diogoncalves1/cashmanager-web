import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import React from "react";
import { formatConverted, getCurrencyByCode } from "../../utils/converter.helpers";
import { Currency } from "@/shared/types/currency";
import { useTranslations } from "next-intl";
import { ConversionResult } from "../../types";

const RecentConversionCard = ({
  recentConversions,
  setAmount,
  setFromCurrency,
  setToCurrency,
  currencies,
  fromCurrency,
  toCurrency,
}: {
  recentConversions: ConversionResult[];
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setFromCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  setToCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  currencies: Currency[];
  fromCurrency: Currency;
  toCurrency: Currency;
}) => {
  const t = useTranslations("CONVERTER");
  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("RECENT_CONVERSIONS")}
        </h3>
        <div className="space-y-2.5">
          {recentConversions.map((conv, i) => (
            <button
              key={`${conv.timestamp.getTime()}-${i}`}
              type="button"
              className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary/50"
              onClick={() => {
                setAmount(String(conv.amount));
                setFromCurrency(currencies.find((c) => c.code === conv.from) || fromCurrency);
                setToCurrency(currencies.find((c) => c.code === conv.to) || toCurrency);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {formatConverted(currencies, conv.amount, conv.from)} {conv.from}
                </span>
                <Badge variant="outline" className="text-xs">
                  {conv.from}/{conv.to}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-semibold">
                  {getCurrencyByCode(currencies, conv.to)?.symbol}
                  {formatConverted(currencies, conv.result, conv.to)} {conv.to}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {conv.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentConversionCard;
