import { useState, useEffect } from "react";
import { DebtPaymentStatus } from "@/models/debtPayment";
import { getAllAccounts } from "@/services/accounts/account.service";
import { AccountBasic } from "@/models/account";
import { DebtBasic } from "@/models/debt";
import { getAllDebts } from "@/services/debts/debt.service";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export function useDebtPaymentForm(id?: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    account_id?: string;
    debt_id?: string;
    amount?: string;
    date?: string;
    status?: DebtPaymentStatus;
    interest_rate?: string;
    description?: string;
    is_monthly_payment: boolean;
  }>({
    status: "completed",
    interest_rate: "0",
    is_monthly_payment: true,
    date: new Date().toISOString().split("T")[0],
  });

  const {
    data: paymentData,
    error: paymentError,
    isLoading: isLoadingPayment,
  } = useSWR(id ? [`/debt-payments/${id}`, { method: "GET" }] : null, fetcher);

  const [debts, setDebts] = useState<DebtBasic[]>([]);
  const [loadingDebts, setLoadingDebts] = useState(true);
  const [accounts, setAccounts] = useState<AccountBasic[]>([]);
  const [loadingAccouts, setLoadingAccount] = useState(true);

  const [dateLimits, setDateLimits] = useState({
    min: "",
    max: new Date().toISOString().split("T")[0],
  });

  const fetchDebts = async () => {
    try {
      const res = await getAllDebts();

      setDebts(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingDebts(false);
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
      setLoadingAccount(false);
    }
  };

  useEffect(() => {
    fetchDebts();
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (paymentError) router.push("/debt-payments");

    if (paymentData?.data) {
      const tx = paymentData.data;
      setFormData({
        account_id: tx.accountId,
        debt_id: tx.debtId,
        interest_rate: tx.interestRate || "",
        amount: tx.amount,
        is_monthly_payment: tx.isMonthlyPayment,
        date: tx.date,
        status: tx.status,
        description: tx.description || "",
      });
    }
  }, [paymentData, paymentError, router]);

  const updateDateLimits = (status: DebtPaymentStatus) => {
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
      const url = id ? `/api/debt-payments/${id}` : "/api/debt-payments";

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
        return { success: false, message: err.message || "Erro ao guardar pagamento" };
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
    isLoadingPayment,
    loadingDebts,
    debts,
    loadingAccouts,
    accounts,
  };
}
