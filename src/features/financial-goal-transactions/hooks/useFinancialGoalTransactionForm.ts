import { useState, useEffect, useCallback } from "react";
import {
  FinancialGoalTransactionStatus,
  FinancialGoalTransactionType,
} from "@/features/financial-goal-transactions/types";
import { getAllFinancialGoalsBasic } from "@/features/financial-goals/api/financial-goal.api";
import { FinancialGoalBasic } from "@/features/financial-goals/types";
import { getAccountsBasic } from "@/features/accounts/server";
import { AccountBasic } from "@/features/accounts";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/shared/fetcher";

type SubmitResult = {
  success: boolean;
  message: string;
};

export function useFinancialGoalTransactionForm(
  id?: string,
  financialGoalId?: string,
  isOpen?: boolean
) {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    account_id?: string;
    financial_goal_id?: string;
    amount?: string;
    type?: FinancialGoalTransactionType;
    date?: string;
    status: FinancialGoalTransactionStatus;
    description?: string;
  }>({
    type: "contribution",
    status: "completed",
    date: new Date().toISOString().split("T")[0],
    financial_goal_id: financialGoalId,
  });

  const [dateLimits, setDateLimits] = useState({
    min: "",
    max: new Date().toISOString().split("T")[0],
  });

  const updateDateLimits = useCallback(
    (status: FinancialGoalTransactionStatus) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<SubmitResult> => {
    setIsSubmitting(true);

    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `/api/financial-goal-transactions/${id}`
        : "/api/financial-goal-transactions";

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

  const {
    data: transactionData,
    error: transactionError,
    isLoading: isLoadingTransaction,
  } = useSWR(
    isOpen ? (id ? [`/financial-goal-transactions/${id}`, { method: "GET" }] : null) : null,
    fetcher
  );

  const [financialGoals, setGoals] = useState<FinancialGoalBasic[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [accounts, setAccounts] = useState<AccountBasic[]>([]);
  const [loadingAccouts, setLoadingAccount] = useState(true);

  const fetchGoals = async () => {
    try {
      setLoadingGoals(true);

      const res = await getAllFinancialGoalsBasic();

      setGoals(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingGoals(false);
    }
  };
  const fetchAccounts = async () => {
    try {
      setLoadingAccount(true);

      const res = await getAccountsBasic();

      setAccounts(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingAccount(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGoals();
      fetchAccounts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transactionError) router.push("/financial-goal-transactions");

    if (transactionData?.data) {
      const tx = transactionData.data;
      setFormData({
        account_id: tx.accountId,
        financial_goal_id: tx.financialGoalId || "",
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

  return {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    loadingGoals,
    financialGoals,
    loadingAccouts,
    accounts,
    isLoadingTransaction,
    transactionData,
  };
}
