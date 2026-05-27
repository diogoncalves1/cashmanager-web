"use client";

import { useEffect, useRef } from "react";
import { getCurrencyByCode, useCurrencies } from "@/features/converter";
import RecentConversionCard from "@/features/converter/components/cards/RecentConversionCard";
import PopularPairsCard from "@/features/converter/components/cards/PopularPairsCard";
import QuickConvertCard from "@/features/converter/components/cards/QuickConvertCard";
import ConverterCard from "@/features/converter/components/cards/ConverterCard";
import { useTranslations } from "next-intl";

const CurrencyConverterContainer = () => {
  const t = useTranslations("CONVERTER");
  const inputRef = useRef<HTMLInputElement>(null);

  const converterState = useCurrencies();
  const { currencies, result, convert, fromCurrency, toCurrency } = converterState;

  const fromInfo = getCurrencyByCode(currencies, fromCurrency.code ?? "");
  const toInfo = getCurrencyByCode(currencies, toCurrency.code ?? "");

  useEffect(() => {
    if (result) convert();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("CURRENCY_CONVERTER")}</h2>
        <p className="mt-1 text-muted-foreground">
          {t("CONVERTER_DESCRIPTION", { count: currencies.length })}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConverterCard
            {...converterState}
            fromInfo={fromInfo}
            toInfo={toInfo}
            inputRef={inputRef}
          />
        </div>

        <div className="space-y-6">
          <QuickConvertCard
            {...converterState}
            result={converterState.result?.result ?? null}
            fromInfo={fromInfo}
          />

          <PopularPairsCard {...converterState} />

          {converterState.recentConversions.length > 0 && (
            <RecentConversionCard {...converterState} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterContainer;
