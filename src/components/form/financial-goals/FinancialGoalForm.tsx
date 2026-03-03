"use client";

import { Input } from "@/components/ui/input";
import Label from "../Label";

import { SwalToast } from "@/components/swal/SwalToast";
import { Currency } from "@/models/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinancialGoalDatePicker } from "./FinancialGoalDatePicker";
import { useFinancialGoalForm } from "./hooks/useFinancialGoalForm";
import LoadingToast from "@/components/swal/LoadingToast";
import { getFinancialGoalPriorities } from "@/models/financialGoal";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import SubmitFormButton from "@/components/ui/button/SubmitFormButton";

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
    loadingCurrencies,
    currencies,
  } = useFinancialGoalForm(id);

  const t = useTranslations("FINANCIAL_GOALS");

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

  const currencySelected = currencies.find((c) => c.id == formData.currency_id);

  const priorityOptions = getFinancialGoalPriorities(t);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Details
          </Label>
          <span className="text-xs text-muted-foreground">Step 1 of 4</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-muted-foreground">
              Name
            </Label>
            <Input
              id="date"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
              }}
              className="h-14 bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-muted-foreground">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                {currencySelected?.symbol || "$"}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.total_amount ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, total_amount: e.target.value }));
                }}
                className="h-14 pl-12 text-lg bg-input border-border placeholder:text-muted-foreground/50"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Select Currency
          </Label>
          <span className="text-xs text-muted-foreground">Step 2 of 4</span>
        </div>
        {!loadingCurrencies ? (
          <Select
            value={formData.currency_id}
            onValueChange={(e: string) => {
              setFormData((prev) => ({ ...prev, currency_id: e }));
            }}
          >
            <SelectTrigger className="h-14 bg-input border-border text-foreground">
              <SelectValue placeholder="Choose a currency" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {!loadingCurrencies &&
                currencies?.map((currency: Currency) => (
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
          </Select>
        ) : (
          <div className="p-2 space-y-2">
            <div className="h-8 rounded bg-muted animate-pulse" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Dates
          </Label>
          <span className="text-xs text-muted-foreground">Step 3 of 4</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-muted-foreground">
              Start
            </Label>
            <FinancialGoalDatePicker
              date={formData.start_date}
              onChangeDate={(newDate: string) => {
                setFormData((p) => ({ ...p, start_date: newDate }));
                updateDateLimits({ due_date: formData.due_date, start_date: newDate });
              }}
              dateLimits={dateLimits.start_date}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-muted-foreground">
              Due
            </Label>
            <FinancialGoalDatePicker
              date={formData.due_date}
              onChangeDate={(newDate: string) => {
                setFormData((p) => ({ ...p, due_date: newDate }));
                updateDateLimits({ due_date: newDate, start_date: formData.start_date });
              }}
              dateLimits={dateLimits.due_date}
            />
          </div>
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Prioridade
          </Label>
          <span className="text-xs text-muted-foreground">Step 4 of 4</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, priority: option.value }));
                updateDateLimits({ due_date: formData.due_date, start_date: formData.start_date });
              }}
              className={cn(
                "relative p-3 rounded-xl border text-center transition-all duration-200",
                "hover:shadow-sm",
                formData.priority === option.value
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/40"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", option.color)} />
                <span className="font-medium text-sm text-foreground">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm text-muted-foreground">
          Description <span className="text-muted-foreground/50">(optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Add a note about this transaction..."
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }));
          }}
          className="min-h-24 bg-input border-border resize-none placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Submit */}
      <SubmitFormButton
        isSubmitting={isSubmitting}
        isDisable={
          !formData.currency_id ||
          !formData.name ||
          !formData.total_amount ||
          !formData.start_date ||
          !formData.due_date ||
          !formData.priority
        }
      />

      {/* Form Helper */}
      <p className="text-center text-xs text-muted-foreground">
        All goals are securely processed and recorded instantly.
      </p>
    </form>
  );
}
