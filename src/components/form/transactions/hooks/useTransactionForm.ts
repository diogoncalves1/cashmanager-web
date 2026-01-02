// hooks/useTransactionForm.ts
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { TransactionStatus, TransactionType } from "@/lib/models/transaction";

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
  });

  const [dateLimits, setDateLimits] = useState({
    min: "",
    max: new Date().toISOString().split("T")[0],
  });

  const {
    data: transactionData,
    error: transactionError,
    isLoading: isLoadingTransaction,
  } = useSWR(id ? [`/transactions/${id}`, { method: "GET" }] : null, fetcher);

  const { data: categoriesData, isLoading: isLoadingCategories } = useSWR(
    [`/categories?type=${formData.type}`, { method: "GET" }],
    fetcher
  );

  const { data: accountsData, isLoading: isLoadingAccounts } = useSWR(
    id ? null : ["/accounts/all", { method: "GET" }],
    fetcher
  );

  useEffect(() => {
    if (transactionError) router.push("/transactions");

    if (transactionData?.data) {
      const tx = transactionData.data;
      setFormData({
        account_id: tx.account_id,
        category_id: tx.category?.id || "",
        amount: tx.amount,
        type: tx.type,
        date: tx.date,
        status: tx.status,
        description: tx.description || "",
      });
      updateDateLimits(tx.status);
    }
  }, [transactionData, transactionError, router]);

  const updateDateLimits = (status: TransactionStatus) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let min = "";
    let max = "";

    if (status === "completed") {
      max = today.toISOString().split("T")[0];

      if ((formData.date as string) > max) setFormData({ ...formData, date: "" });
    } else if (status === "pending") {
      min = today.toISOString().split("T")[0];

      if ((formData.date as string) < min) setFormData({ ...formData, date: "" });
    }

    setDateLimits({ min, max });
  };

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
    } catch (err: any) {
      return { success: false, message: err.message || "Erro ao guardar transação" };
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
    categoriesData,
    accountsData,
    transactionData,
  };
}
