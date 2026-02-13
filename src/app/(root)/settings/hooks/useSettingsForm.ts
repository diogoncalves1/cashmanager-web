import { useState, useEffect } from "react";
import { Currency } from "@/models/currency";
import { getCurrencies } from "@/services/currencies/currency.service";
import { Language } from "@/models/language";
import { getLanguages } from "@/services/languages/languages.service";
import { useAuth } from "@/context/AuthContext";

type FormData = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  lang?: "pt" | "en";
  currency_id?: string;
};

export function useSettingsForm(id?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [initialData, setInitialData] = useState<FormData>({
    id: user.id,
    username: user.username,
    firstName: user.name.split(" ")[0],
    lastName: user.name.split(" ")[user.name.split(" ").length - 1],
    email: user.email,
    lang: user.preferences?.lang,
    currency_id: user.preferences?.currency.id,
  });
  const [formData, setFormData] = useState<FormData>({
    id: user.id,
    username: user.username,
    firstName: user.name.split(" ")[0],
    lastName: user.name.split(" ")[user.name.split(" ").length - 1],
    email: user.email,
    lang: user.preferences?.lang,
    currency_id: user.preferences?.currency.id,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData({
        id: user.id,
        username: user.username,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[user.name.split(" ").length - 1],
        email: user.email,
        lang: user.preferences?.lang,
        currency_id: user.preferences?.currency.id,
      });
      setInitialData({
        id: user.id,
        username: user.username,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[user.name.split(" ").length - 1],
        email: user.email,
        lang: user.preferences?.lang,
        currency_id: user.preferences?.currency.id,
      });
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  const fetchLanguages = async () => {
    try {
      setLoadingLanguages(true);
      const res = await getLanguages();

      setLanguages(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoadingLanguages(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      setLoadingCurrencies(true);
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
    fetchLanguages();
  }, []);

  type SubmitResult = {
    success: boolean;
    message: string;
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    setIsSubmitting(true);

    try {
      const url = `/api/auth/me`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, name: `${formData.firstName} ${formData.lastName}` }),
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
    languages,
    loadingLanguages,
    user,
    initialData,
    isLoading,
    setInitialData,
  };
}
