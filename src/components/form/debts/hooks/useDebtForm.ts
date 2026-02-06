import { useState, useEffect } from "react";
import { Currency } from "@/models/currency";
import { getCurrencies } from "@/services/currencies/currency.service";
import { Debt } from "@/models/debt";
import { getDebtById } from "@/app/(root)/(menu)/debts/[id]/services/debt.service";

interface FormData {
  name: string;
  description: string;
  total_amount: string;
  monthly_amount: string;
  interest_rate: string;
  currency_id: string;
  start_date: string;
  due_date: string;
  months: string;
}
export function useDebtForm(id?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    total_amount: "",
    monthly_amount: "",
    interest_rate: "",
    currency_id: "",
    start_date: new Date().toISOString().split("T")[0],
    due_date: "",
    months: "",
  });

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [debt, setDebt] = useState<Debt>();
  const [loadingDebt, setLoadingDebt] = useState(false);

  const [dateLimits, setDateLimits] = useState({
    start_date: {
      min: "",
      max: "",
    },
    due_date: {
      min: "",
      max: "",
    },
  });

  const updateDateLimits = ({ due_date, start_date }: { due_date: string; start_date: string }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = start_date;
    const max = due_date;

    setDateLimits({ due_date: { min: min, max: "" }, start_date: { min: "", max: max } });
  };

  const fetchDebt = async (id: string) => {
    try {
      const res = await getDebtById(id);

      setDebt(res.data);

      if (res.data) {
        const debt = res.data;
        setFormData({
          name: debt.name,
          description: debt.description,
          total_amount: debt.totalAmount.toString(),
          monthly_amount: debt.monthlyAmount.toString(),
          interest_rate: debt.interestRate.toString(),
          currency_id: debt.currencyId,
          start_date: debt.startDate,
          due_date: debt.dueDate,
          months: debt.months.toString(),
        });

        updateDateLimits({ due_date: debt.dueDate, start_date: debt.startDate });
      }

      console.log(debt);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingDebt(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await getCurrencies();

      setCurrencies(res.data);
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

  useEffect(() => {
    if (id) {
      fetchDebt(id);
    }
  }, [id]);

  type SubmitResult = {
    success: boolean;
    message: string;
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    setIsSubmitting(true);

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/debts/${id}` : "/api/debts";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      return { success: true, message: result.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Erro ao guardar dívida" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    currencies,
    loadingCurrencies,
    debt,
    loadingDebt,
    updateDateLimits,
    dateLimits,
  };
}
