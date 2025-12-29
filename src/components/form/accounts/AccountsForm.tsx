"use client";

import useSWR from "swr";
import { AccountType, accountTypes } from "@/lib/models/account";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { FormEvent, useEffect, useState } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Label from "../Label";
import { Button } from "@/components/ui/button";
import Select from "react-select";

import Checkbox from "../input/Checkbox";
import { SwalToast } from "@/components/swal/SwalToast";
import { Currency } from "@/lib/models/currency";

type AccountsFormProps = {
  id?: string;
};

interface AccountFormData {
  name: string;
  currency_id: string;
  type: AccountType | string;
  active: boolean;
}

export default function AccountsForm({ id }: AccountsFormProps) {
  const router = useRouter();
  const [isLoadingHandle, setIsLoadingHandle] = useState(false);

  const {
    data: accountData,
    error: accountError,
    isLoading: isLoadingAccount,
  } = useSWR(id ? [`/accounts/${id}`, { method: "GET" }] : null, fetcher);

  const {
    data: currenciesData,
    error: currenciesError,
    isLoading: isLoadingCurrencies,
  } = useSWR([`/currencies`, { method: "GET" }], fetcher);

  const [formData, setFormData] = useState<AccountFormData>({
    name: "",
    currency_id: "",
    active: true,
    type: "",
  });

  useEffect(() => {
    if (accountError) {
      router.push("/accounts");
    }

    if (accountData)
      setFormData({
        type: accountData.data.type,
        active: accountData.data.status ? true : false,
        name: accountData.data.name,
        currency_id: accountData.data.currencyId,
      });
  }, [accountData, accountError, router]);

  if (isLoadingAccount || isLoadingCurrencies || (formData.currency_id == "" && id)) return <></>;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingHandle(true);

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/accounts/${id}` : "/api/accounts";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      return SwalToast({ message: data.message, icon: "success" });
    } catch (err: any) {
      console.error(err);
      return SwalToast({ message: err.message ?? "Erro ao tentar atualizar conta", icon: "error" });
    } finally {
      setIsLoadingHandle(false);
    }
  };

  console.log(formData);

  return (
    <Form
      onSubmit={handleSubmit}
      className="grid-cols-12 xl:mx-20 gap-5 p-5 rounded-sm grid border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]"
    >
      <div className="md:col-span-6 col-span-12">
        <Label>Name</Label>
        <Input
          placeholder="Name..."
          required={true}
          defaultValue={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
      </div>
      <div className="md:col-span-6 col-span-12">
        <Label>Moeda</Label>
        <Select
          isSearchable={true}
          key={formData.currency_id}
          options={currenciesData.data.map((c: Currency) => {
            return {
              value: c.id,
              label: c.code + " " + c.name,
            };
          })}
          onChange={(e: any) => {
            setFormData((prev) => ({ ...prev, currency_id: e.value }));
          }}
          defaultValue={currenciesData.data
            .map((c: Currency) => ({ value: c.id, label: c.code + " " + c.name }))
            .find((option: any) => option.value === formData.currency_id)}
          required={true}
        ></Select>
      </div>
      <div className="col-span-12">
        <Label>Tipo</Label>
        <Select
          key={formData.type}
          options={accountTypes}
          onChange={(e: any) => {
            setFormData((prev) => ({ ...prev, type: e.value }));
          }}
          defaultValue={accountTypes.find((type) => type.value === formData.type)}
          required={true}
        ></Select>
      </div>
      <div className="col-span-12">
        <div className="justify-between flex">
          <div>
            <Checkbox
              checked={formData.active}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, active: value }));
              }}
              label="Ativa"
            />
          </div>
          <Button variant={"outline"} disabled={isLoadingHandle} className="mt-4 ">
            {isLoadingHandle ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
