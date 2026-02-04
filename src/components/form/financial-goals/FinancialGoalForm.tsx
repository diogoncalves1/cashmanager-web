"use client";

import Form from "../Form";
import Input from "../input/InputField";
import Label from "../Label";
import { Button } from "@/components/ui/button";

import { SwalToast } from "@/components/swal/SwalToast";
import { Currency } from "@/models/currency";
import RichTextEditor from "../input/RichTextEditor";
import { FinancialGoalDatePicker } from "./FinancialGoalDatePicker";
import { useFinancialGoalForm } from "./hooks/useFinancialGoalForm";
import LoadingToast from "@/components/swal/LoadingToast";
import Select from "react-select";

type Props = {
  id?: string;
};

export function FinancialGoalForm({ id }: Props) {
  const {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    isLoadingFinancialGoal,
    isLoadingCurrencies,
    currenciesData,
  } = useFinancialGoalForm(id);

  if (isLoadingFinancialGoal) {
    return <div className="h-96 animate-pulse bg-gray-100 rounded" />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    LoadingToast({
      title: id ? "A atualizar..." : "A criar...",
      message: id ? "A atualizar transação..." : "A criar a sua transação...",
    });
    e.preventDefault();
    const result = await handleSubmit();
    SwalToast({
      message: result.message,
      icon: result.success ? "success" : "error",
    });
  };

  return (
    <Form
      onSubmit={onSubmit}
      className="grid-cols-12 xl:mx-20 gap-5 p-5 rounded-sm grid border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]"
    >
      {/* Name */}
      <div className="md:col-span-6 col-span-12">
        <Label>Nome</Label>
        <Input
          placeholder="Nome..."
          required
          defaultValue={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* Total Amount */}
      <div className="md:col-span-3 col-span-12">
        <Label>Valor Total</Label>
        <Input
          type="number"
          step={0.01}
          placeholder="0.00"
          required
          defaultValue={(formData.total_amount as number) || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, total_amount: parseFloat(e.target.value) }))
          }
        />
      </div>

      {/* Currency */}
      <div className="md:col-span-3 col-span-12">
        <Label>Moeda</Label>
        {isLoadingCurrencies ? (
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ) : (
          <>
            {/* <Select
              value={formData.currency_id || ""}
              onValueChange={(e: string) => {
                setFormData((prev: any) => ({ ...prev, currency_id: e }));
              }}
            >
              <SelectTrigger className="h-14 bg-input border-border text-foreground">
                <SelectValue placeholder="Choose a financial goal" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {!isLoadingCurrencies &&
                  currenciesData.data.map((currency: Currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id}
                      className="py-3 cursor-pointer focus:bg-secondary"
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-medium">{currency.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {currency.code} {currency.symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select> */}
            <Select
              isSearchable
              key={formData.currency_id}
              options={currenciesData.data.map((c: Currency) => ({
                value: c.id,
                label: `${c.code} - ${c.name}`,
              }))}
              onChange={(e: any) => setFormData((prev) => ({ ...prev, currency_id: e.value }))}
              defaultValue={currenciesData.data
                .map((c: Currency) => ({
                  value: c.id,
                  label: `${c.code} - ${c.name}`,
                }))
                .find((c: any) => {
                  console.log(c.value);
                  console.log(`${formData.currency_id}`);
                  return c.value === `${formData.currency_id}`;
                })}
              required
            />
          </>
        )}
      </div>

      {/* Start Date */}
      <div className="md:col-span-3 col-span-12">
        <Label>Data de Início</Label>
        <FinancialGoalDatePicker
          date={formData.start_date}
          onChangeDate={(newDate: string) => {
            setFormData((p) => ({ ...p, start_date: newDate }));
            updateDateLimits({ due_date: formData.due_date, start_date: newDate });
          }}
          dateLimits={dateLimits.start_date}
        />
      </div>

      {/* Due Date */}
      <div className="md:col-span-3 col-span-12">
        <Label>Data de Vencimento</Label>
        <FinancialGoalDatePicker
          date={formData.due_date}
          onChangeDate={(newDate: string) => {
            setFormData((p) => ({ ...p, due_date: newDate }));
            updateDateLimits({ due_date: newDate, start_date: formData.start_date });
          }}
          dateLimits={dateLimits.due_date}
        />
      </div>

      {/* Priority */}
      <div className="md:col-span-6 col-span-12">
        <Label>Prioridade</Label>
        <Select
          key={formData.priority}
          options={[
            { value: "low", label: "Baixa" },
            { value: "medium", label: "Média" },
            { value: "high", label: "Alta" },
          ]}
          onChange={(e: any) => setFormData((prev) => ({ ...prev, priority: e.value }))}
          defaultValue={[
            { value: "low", label: "Baixa" },
            { value: "medium", label: "Média" },
            { value: "high", label: "Alta" },
          ].find((p) => p.value === formData.priority)}
          required
        />
      </div>

      {/* Description */}
      <div className="col-span-12">
        <Label>Descrição</Label>
        <RichTextEditor
          content={formData.description || ""}
          onChange={(html) => setFormData((p) => ({ ...p, description: html }))}
        />
      </div>

      {/* Submit */}
      <div className="col-span-12 flex justify-end">
        <Button variant="outline" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </Form>
  );
}
