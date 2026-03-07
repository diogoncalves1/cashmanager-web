import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { TransactionStatus, TransactionType } from "@/models/transaction";

export function useTransactionForm(id?: string) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    account_id?: string;
    category_id?: string;
    amount?: number;
    type: TransactionType;
    date?: string;
    status: TransactionStatus;
    description?: string;
  }>({
    type: "revenue",
    status: "completed",
    date: new Date().toISOString().split("T")[0],
  });

  const [dateLimits, setDateLimits] = useState<{ min: string; max: string }>({
    min: "",
    max: new Date().toISOString().split("T")[0],
  });

  const {
    data: transactionData,
    error: transactionError,
    isLoading: isLoadingTransaction,
  } = useSWR(id ? [`/transactions/${id}`, { method: "GET" }] : null, fetcher);

  const { data: categories, isLoading: isLoadingCategories } = useSWR(
    [`/categories?type=${formData.type}`, { method: "GET" }],
    fetcher
  );

  const { data: accounts, isLoading: isLoadingAccounts } = useSWR(
    id ? null : ["/accounts/all", { method: "GET" }],
    fetcher
  );

  const updateDateLimits = useCallback(
    (status: TransactionStatus) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStr = today.toISOString().split("T")[0];

      let min = "";
      let max = "";

      if (status === "completed") {
        max = todayStr;

        if ((formData.date as string) > max) {
          setFormData((prev) => ({ ...prev, date: "" }));
        }
      } else if (status === "pending") {
        min = todayStr;

        if ((formData.date as string) < min) {
          setFormData((prev) => ({ ...prev, date: "" }));
        }
      }

      setDateLimits({ min, max });
    },
    [formData.date]
  );

  useEffect(() => {
    if (transactionError) router.push("/transactions");

    if (transactionData?.data) {
      const tx = transactionData.data;
      setFormData({
        account_id: tx.accountId,
        category_id: tx.category?.id || "",
        amount: tx.amount,
        type: tx.type,
        date: tx.date,
        status: tx.status,
        description: tx.description || "",
      });
    }
  }, [transactionData, transactionError, router]);

  useEffect(() => {
    updateDateLimits(formData.status);
  }, [formData.status, updateDateLimits]);

  type SubmitResult = {
    success: boolean;
    message: string;
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    setIsSubmitting(true);

    if (formData.category_id === "") return { success: false, message: "Selecione a categoria." };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/transactions/${id}` : "/api/transactions";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      return { success: true, message: result.message };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, message: err.message || "Erro ao guardar transação" };
      }
      return { success: false, message: String(err) };
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
    isLoadingTransaction,
    isLoadingCategories,
    isLoadingAccounts,
    categories,
    accounts,
    transactionData,
  };
}
