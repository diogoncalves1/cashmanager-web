import { useState, useEffect } from "react";
import { getCurrencies } from "@/shared/api/currency";
import { Currency } from "@/shared/types/currency";
import { convertCurrency } from "../utils/converter.helpers";
import { ConversionResult } from "../types";

export function useCurrencies() {
  const [amount, setAmount] = useState("1000");

  const [fromCurrency, setFromCurrency] = useState<Currency>({
    id: "1",
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    rate: 1,
  });
  const [toCurrency, setToCurrency] = useState<Currency>({
    id: "2",
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 0.85,
  });

  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentConversions, setRecentConversions] = useState<ConversionResult[]>([]);

  const [result, setResult] = useState<ConversionResult | null>(null);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const convert = async (defaultAmount: number | null = null) => {
    const numAmount = defaultAmount ? defaultAmount : Number.parseFloat(amount);
    if (!amount || Number.isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      setResult(null);
      return;
    }
    if (fromCurrency === toCurrency) {
      setError("Source and target currencies must be different.");
      setResult(null);
      return;
    }

    setError(null);
    setIsConverting(true);

    try {
      if (!fromCurrency || !toCurrency) {
        return;
      }
      const { result: converted, rate } = convertCurrency(numAmount, fromCurrency, toCurrency);
      const conversionResult: ConversionResult = {
        result: converted,
        rate,
        from: fromCurrency?.code || "",
        to: toCurrency?.code || "",
        amount: numAmount,
        timestamp: new Date(),
      };
      setResult(conversionResult);
      setRecentConversions((prev) => [conversionResult, ...prev].slice(0, 5));
    } catch {
      setError("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoadingCurrencies, setLoadingCurrencies] = useState(true);

  const fetchCurrencies = async () => {
    try {
      setLoadingCurrencies(true);
      const res = await getCurrencies();

      setCurrencies(res.data);
      setFromCurrency(res.data.find((c) => c.code === "USD") || res.data[0]);
      setToCurrency(res.data.find((c) => c.code === "EUR") || res.data[1]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingCurrencies(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return {
    amount,
    setAmount,
    fromCurrency,
    toCurrency,
    setFromCurrency,
    setToCurrency,
    result,
    convert,
    swapCurrencies,
    currencies,
    isLoadingCurrencies,
    isConverting,
    setError,
    error,
    recentConversions,
  };
}
