import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { FinancialGoalPriority } from "@/lib/models/financialGoal";

interface FinancialGoalFormData {
  name: string;
  total_amount?: number;
  currency_id: string;
  start_date: string;
  due_date: string;
  description: string;
  priority: FinancialGoalPriority | string;
}

export function useFinancialGoalForm(id?: string) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FinancialGoalFormData>({
    name: "",
    currency_id: "",
    start_date: "",
    due_date: "",
    description: "",
    priority: "",
  });

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

  const {
    data: financialGoalData,
    error: financialGoalError,
    isLoading: isLoadingFinancialGoal,
  } = useSWR(id ? [`/financial-goals/${id}`, { method: "GET" }] : null, fetcher);

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useSWR(
    [`/currencies`, { method: "GET" }],
    fetcher
  );

  useEffect(() => {
    if (financialGoalError) router.push("/financial-goals");

    if (financialGoalData?.data) {
      const fg = financialGoalData.data;
      console.log(fg);
      setFormData({
        name: fg.name,
        total_amount: fg.totalAmount,
        currency_id: fg.currencyId || "",
        start_date: fg.startDate,
        due_date: fg.dueDate,
        description: fg.description || "",
        priority: fg.priority,
      });
      updateDateLimits({ due_date: fg.dueDate, start_date: fg.startDate });
    }
  }, [financialGoalData, financialGoalError, router]);

  const updateDateLimits = ({ due_date, start_date }: { due_date: string; start_date: string }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = start_date;
    const max = due_date;

    setDateLimits({ due_date: { min: min, max: "" }, start_date: { min: "", max: max } });
  };

  type SubmitResult = {
    success: boolean;
    message: string;
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    setIsSubmitting(true);

    if (formData.currency_id === "") return { success: false, message: "Selecione a moeda." };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/financial-goals/${id}` : "/api/financial-goals";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      return { success: true, message: result.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Erro ao guardar meta financeira" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    isLoadingFinancialGoal,
    isLoadingCurrencies,
    currenciesData,
  };
}
