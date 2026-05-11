import { useState, useEffect } from "react";
import { Currency } from "@/shared/types/currency";
import { getCurrencies } from "@/shared/api/currency";
import { Language } from "@/shared/types/language";
import { getLanguages } from "@/shared/api/language";
import { useAuth } from "@/features/auth";

type FormData = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  lang?: "pt" | "en";
  currency_id?: string;
};

export function useSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const [initialData, setInitialData] = useState<FormData>({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    lang: "en",
    currency_id: "",
  });

  const [formData, setFormData] = useState<FormData>({ ...initialData });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      const nameParts = user.name?.split(" ") || ["", ""];
      setFormData({
        id: user.id,
        username: user.username,
        firstName: nameParts[0],
        lastName: nameParts[nameParts.length - 1],
        email: user.email,
        lang: user.preferences?.lang || "en",
        currency_id: user.preferences?.currency?.id || "",
      });
      setInitialData({
        id: user.id,
        username: user.username,
        firstName: nameParts[0],
        lastName: nameParts[nameParts.length - 1],
        email: user.email,
        lang: user.preferences?.lang || "en",
        currency_id: user.preferences?.currency?.id || "",
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user]);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, message: err.message || "Erro ao guardar dívida" };
      } else {
        return { success: false, message: String(err) || "Erro ao guardar dívida" };
      }
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
