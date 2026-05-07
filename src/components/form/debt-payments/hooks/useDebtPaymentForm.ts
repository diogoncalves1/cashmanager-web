import { useState, useEffect } from "react";
import { DebtPaymentStatus } from "@/types/debtPayment";
import { getAccountsBasic } from "@/features/accounts/api/account.api";
import { AccountBasic } from "@/features/accounts/types/index";
import { DebtBasic } from "@/types/debt";
import { getAllDebts } from "@/services/debt";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

type SubmitResult = {
  success: boolean;
  message: string;
};

export function useDebtPaymentForm(id?: string, debtId?: string, isOpen?: boolean) {
  const router = useRouter();

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
    debt_id: debtId,
  });

  const [dateLimits, setDateLimits] = useState({
    min: "",
    max: new Date().toISOString().split("T")[0],
  });

  const updateDateLimits = (status: DebtPaymentStatus) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let min = "";
    let max = "";

    if (status === "completed") {
      max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      if ((formData.date as string) > max) setFormData({ ...formData, date: "" });
    } else if (status === "pending") {
      min = today.toISOString().split("T")[0];

      if ((formData.date as string) < min) setFormData({ ...formData, date: "" });
    }

    setDateLimits({ min, max });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const {
    data: paymentData,
    error: paymentError,
    isLoading: isLoadingPayment,
  } = useSWR(isOpen ? (id ? [`/debt-payments/${id}`, { method: "GET" }] : null) : null, fetcher);

  const [debts, setDebts] = useState<DebtBasic[]>([]);
  const [loadingDebts, setLoadingDebts] = useState(true);
  const [accounts, setAccounts] = useState<AccountBasic[]>([]);
  const [loadingAccouts, setLoadingAccount] = useState(true);

  const fetchDebts = async () => {
    try {
      setLoadingDebts(true);
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
      fetchDebts();
      fetchAccounts();
    }
  }, [isOpen]);

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
