import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { getCurrencies } from "@/services/currencies/currency.service";
import { Currency } from "@/models/currency";
import { Account, AccountType } from "@/models/account";

interface AccountFormData {
  name: string;
  currency_id?: string;
  type: AccountType | string;
  active: boolean;
}

export function useAccountForm(id?: string, account?: Account) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);

  const [formData, setFormData] = useState<AccountFormData>({
    name: "",
    type: "",
    active: true,
  });

  const { data: accountData, error: accountError } = useSWR(
    id && !account ? [`/accounts/${id}`, { method: "GET" }] : null,
    fetcher
  );

  useEffect(() => {
    if (accountError) router.push("/accounts");

    let data = accountData?.data;
    if (account && !accountData) {
      data = account;
    }

    if (data) {
      const a = data;
      setFormData({
        name: a.name,
        currency_id: a.currencyId,
        type: a.type,
        active: a.active,
      });
    }
    setIsLoadingAccount(false);
  }, [accountData, account, accountError, router]);

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

  type SubmitResult = {
    success: boolean;
    message: string;
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    setIsSubmitting(true);

    if (formData.currency_id === "") return { success: false, message: "Selecione a moeda." };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/accounts/${id}` : "/api/accounts";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setFormData({ name: "", type: "", active: true, currency_id: undefined });

      return { success: true, message: result.message };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, message: err.message || "Erro ao guardar conta" };
      }
      return { success: false, message: String(err) };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    isLoadingAccount,
    loadingCurrencies,
    currencies,
  };
}
