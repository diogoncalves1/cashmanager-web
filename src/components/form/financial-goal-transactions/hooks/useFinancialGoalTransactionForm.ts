import { useState, useEffect } from "react";
import { TransactionStatus } from "@/models/transaction";
import {
  FinancialGoalTransactionStatus,
  FinancialGoalTransactionType,
} from "@/models/financialGoalTransactions";
import { getAllFinancialGoals } from "@/services/financial-goals/financialGoal.service";
import { FinancialGoalBasic } from "@/models/financialGoal";
import { getAllAccounts } from "@/services/accounts/account.service";
import { AccountBasic } from "@/models/account";

export function useFinancialGoalTransactionForm(id?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    account_id?: string;
    financial_goal_id?: string;
    amount?: string;
    type?: FinancialGoalTransactionType;
    date?: string;
    status?: FinancialGoalTransactionStatus;
    description?: string;
  }>({
    type: "contribution",
    status: "completed",
    date: new Date().toISOString().split("T")[0],
  });

  const [financialGoals, setGoals] = useState<FinancialGoalBasic[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [accounts, setAccounts] = useState<AccountBasic[]>([]);
  const [loadingAccouts, setLoadingAccount] = useState(true);

  const [dateLimits, setDateLimits] = useState({
    min: "",
    max: new Date().toISOString().split("T")[0],
  });

  const fetchGoals = async () => {
    try {
      const res = await getAllFinancialGoals();

      setGoals(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingAccount(false);
    }
  };
  const fetchAccounts = async () => {
    try {
      const res = await getAllAccounts();

      setAccounts(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchAccounts();
  }, []);

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
    loadingGoals,
    financialGoals,
    loadingAccouts,
    accounts,
  };
}
