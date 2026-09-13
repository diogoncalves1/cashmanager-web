"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { Currency } from "@/shared/types/currency";
import { getFinancialGoalPriorities } from "@/features/financial-goals";
import { useFinancialGoalForm } from "@/features/financial-goals/server";
import LoadingToast from "@/components/swal/LoadingToast";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/shared/hooks/useToast";
import { DatePicker } from "@/shared/ui/date-picker";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/shared/ui/custom-select";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, Flag, Loader2, Target, WalletCards } from "lucide-react";

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
  const { toast } = useToast();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key));

  const onSubmit = async (e: React.FormEvent) => {
    const loadingT = LoadingToast({
      title: id ? t("SAVING") : t("CREATING"),
      message: id ? t("SAVING_TEXT") : t("CREATING_TEXT"),
    });
    e.preventDefault();
    const result = await handleSubmit();
    loadingT.close();
    toast({ description: result.message });
  };

  const currencySelected = currencies.find((c) => c.id == formData.currency_id);

  const priorityOptions = getFinancialGoalPriorities(t);
  const selectedPriority = priorityOptions.find((option) => option.value === formData.priority);
  const completedFields = [
    formData.name,
    formData.total_amount,
    formData.currency_id,
    formData.start_date,
    formData.due_date,
    formData.priority,
  ].filter(Boolean).length;
  const formProgress = Math.round((completedFields / 6) * 100);
  const isSubmitDisabled =
    !formData.currency_id ||
    !formData.name ||
    !formData.total_amount ||
    !formData.start_date ||
    !formData.due_date ||
    !formData.priority;

  return (
    <form onSubmit={onSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4">
        <section className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800/60 xl:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Target className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">{t("DETAILS")}</Label>
                <p className="text-xs text-muted-foreground">{t("GOAL_DETAILS_HELPER")}</p>
              </div>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {t("STEP")} 1 {t("OF")} 4
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                {t("NAME")}
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                }}
                placeholder={t("NAME_PLACEHOLDER")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm text-muted-foreground">
                {t("TOTAL_AMOUNT")}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.total_amount ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, total_amount: e.target.value }));
                }}
                leftIcon={<span>{currencySelected?.symbol || "$"}</span>}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800/60 xl:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                <WalletCards className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  {t("SELECT_CURRENCY")}
                </Label>
                <p className="text-xs text-muted-foreground">{t("CURRENCY_HELPER")}</p>
              </div>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {t("STEP")} 2 {t("OF")} 4
            </span>
          </div>

          {!loadingCurrencies ? (
            <CustomSelect
              value={formData.currency_id ?? ""}
              placeholder={t("SELECT_CURRENCY")}
              className="w-full"
              options={
                currencies?.map((currency: Currency) => ({
                  label: currency.name,
                  value: currency.id,
                  keywords: `${currency.code} ${currency.symbol}`,
                  icon: (
                    <span className="text-xs font-medium text-muted-foreground">
                      {currency.code} {currency.symbol}
                    </span>
                  ),
                })) ?? []
              }
              open={openDropdown === "currency"}
              onToggle={() => toggle("currency")}
              onSelect={(e: string) => {
                setFormData((prev) => ({ ...prev, currency_id: e }));
              }}
            />
          ) : (
            <div className="space-y-2 p-2">
              <div className="h-10 animate-pulse rounded bg-muted" />
            </div>
          )}
        </section>

        <section className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800/60 xl:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <CalendarDays className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">{t("DATES")}</Label>
                <p className="text-xs text-muted-foreground">{t("DATES_HELPER")}</p>
              </div>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {t("STEP")} 3 {t("OF")} 4
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm text-muted-foreground">
                {t("START")}
              </Label>
              <DatePicker
                date={formData.start_date}
                onChangeDate={(newDate: string) => {
                  setFormData((p) => ({ ...p, start_date: newDate }));
                  updateDateLimits({ due_date: formData.due_date, start_date: newDate });
                }}
                className="w-full"
                dateLimits={dateLimits.start_date}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm text-muted-foreground">
                {t("DUE")}
              </Label>
              <DatePicker
                date={formData.due_date}
                onChangeDate={(newDate: string) => {
                  setFormData((p) => ({ ...p, due_date: newDate }));
                  updateDateLimits({ due_date: newDate, start_date: formData.start_date });
                }}
                className="w-full"
                dateLimits={dateLimits.due_date}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800/60 xl:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Flag className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">{t("PRIORITY")}</Label>
                <p className="text-xs text-muted-foreground">{t("PRIORITY_HELPER")}</p>
              </div>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {t("STEP")} 4 {t("OF")} 4
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, priority: option.value }));
                  updateDateLimits({
                    due_date: formData.due_date,
                    start_date: formData.start_date,
                  });
                }}
                className={cn(
                  "relative min-h-14 rounded-md border p-3 text-left transition-all duration-200",
                  "hover:shadow-sm",
                  formData.priority === option.value
                    ? "border-accent bg-accent/10 shadow-sm"
                    : "border-transparent bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-full", option.color)} />
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800/60 xl:p-5">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-muted-foreground">
              {t("DESCRIPTION")} <span className="text-muted-foreground/50">({t("OPTIONAL")})</span>
            </Label>
            <Textarea
              id="description"
              placeholder={t("DESCRIPTION_TEXT")}
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }));
              }}
              className="min-h-28 resize-none placeholder:text-muted-foreground/50"
            />
          </div>
        </section>
      </div>

      <aside className="grid gap-4 self-start xl:sticky xl:top-24">
        <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("GOAL_PREVIEW")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {formData.name || t("UNTITLED_GOAL")}
              </h2>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Target className="size-5" strokeWidth={1.75} />
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("FORM_COMPLETION")}</span>
              <span>{formProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${formProgress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t("TOTAL_AMOUNT")}</span>
              <span className="font-semibold text-foreground">
                {currencySelected?.symbol || "$"}
                {formData.total_amount || "0.00"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t("CURRENCY")}</span>
              <span className="font-medium text-foreground">
                {currencySelected?.code || t("NOT_SELECTED")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t("PRIORITY")}</span>
              <span className="font-medium text-foreground">
                {selectedPriority?.label || t("NOT_SELECTED")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t("START")}</span>
              <span className="font-medium text-foreground">
                {formData.start_date || t("NOT_SELECTED")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t("DUE")}</span>
              <span className="font-medium text-foreground">
                {formData.due_date || t("NOT_SELECTED")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 text-accent" strokeWidth={1.75} />
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t("SMART_SETUP")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("SMART_SETUP_TEXT")}</p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="app_submit"
          size="lg"
          disabled={isSubmitDisabled || isSubmitting}
          className="w-full"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {id ? t("SAVE") : t("CREATE")}
        </Button>

        <p className="text-center text-xs text-muted-foreground">{t("FORM_HELPER")}</p>
      </aside>
    </form>
  );
}
