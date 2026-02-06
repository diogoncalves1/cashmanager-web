"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import SubmitFormButton from "@/components/ui/button/SubmitFormButton";
import { FinancialGoalTransactionStatus } from "@/models/financialGoalTransactions";
import LoadingToast from "@/components/swal/LoadingToast";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { DebtBasic } from "@/models/debt";
import { useDebtPaymentForm } from "@/components/form/debt-payments/hooks/useDebtPaymentForm";
import Checkbox from "@/components/form/input/Checkbox";

const statusOptions = [
  { id: "pending", label: "Pending", color: "bg-yellow-500" },
  { id: "completed", label: "Completed", color: "bg-accent" },
];

export function DebtPaymentForm() {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");

  const {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    debts,
    loadingDebts,
    accounts,
    loadingAccouts,
  } = useDebtPaymentForm();

  const selectedDebtData = debts.find((g) => g.id === formData.debt_id);
  const progress = selectedDebtData
    ? Math.round((selectedDebtData.current / selectedDebtData.target) * 100)
    : 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    LoadingToast({
      title: t("CREATING"),
      message: "A adicionar pagamento...",
    });

    const res = await handleSubmit();

    if (res.success) {
      return SwalToast({ message: res.message, icon: "success" });
    }
    return SwalToast({ message: res.message, icon: "error" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Select Debt
          </Label>
          <span className="text-xs text-muted-foreground">Step 1 of 4</span>
        </div>
        <Select
          value={formData.debt_id || ""}
          onValueChange={(e: string) => {
            setFormData((prev: any) => ({
              ...prev,
              debt_id: e,
              interest_rate: ((debts.find((g) => g.id === e)?.interestRate ?? 0) / 12).toFixed(4),
              amount: (debts.find((g) => g.id === e)?.monthlyAmount ?? 0).toFixed(2),
            }));
          }}
        >
          <SelectTrigger className="h-14 bg-input border-border text-foreground">
            <SelectValue placeholder="Choose a debt" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {!loadingDebts &&
              debts.map((debt: DebtBasic) => (
                <SelectItem
                  key={debt.id}
                  value={debt.id}
                  className="py-3 cursor-pointer focus:bg-secondary"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-medium">{debt.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {debt.currentFormated} of {debt.targetFormated}
                    </span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {selectedDebtData && (
          <div className="p-4 rounded-xl bg-secondary border border-border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{selectedDebtData.name}</span>
              <span className="text-sm text-accent font-medium">{progress}% complete</span>
            </div>
            <div className="h-2.5 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{selectedDebtData.currentFormated}</span>
              <span>{selectedDebtData.targetFormated}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Account
          </Label>
          <span className="text-xs text-muted-foreground">Step 2 of 4</span>
        </div>
        <Select
          value={formData.account_id || ""}
          onValueChange={(e) => {
            setFormData((prev: any) => ({ ...prev, account_id: e }));
          }}
        >
          <SelectTrigger className="h-14 bg-input border-border text-foreground">
            <SelectValue placeholder="Select source account" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {!loadingAccouts &&
              accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="py-3 cursor-pointer focus:bg-secondary"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-xs text-muted-foreground">{account.type}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount and Date */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Details
          </Label>
          <span className="text-xs text-muted-foreground">Step 3 of 4</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-muted-foreground">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                {selectedDebtData?.currencySymbol || "$"}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount ?? ""}
                onChange={(e) => {
                  setFormData((prev: any) => ({ ...prev, amount: e.target.value }));
                }}
                className="h-14 pl-12 text-lg bg-input border-border placeholder:text-muted-foreground/50"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-muted-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              max={dateLimits.max}
              min={dateLimits.min}
              value={formData.date}
              onChange={(e) => {
                setFormData((prev: any) => ({ ...prev, date: e.target.value }));
              }}
              className="h-14 bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="interest_rate" className="text-sm text-muted-foreground">
              Interest Rate
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                %
              </span>
              <Input
                id="interest_rate"
                type="number"
                placeholder="0.00"
                value={formData.interest_rate ?? ""}
                onChange={(e) => {
                  setFormData((prev: any) => ({ ...prev, interest_rate: e.target.value }));
                }}
                className="h-14 pl-12 text-lg bg-input border-border placeholder:text-muted-foreground/50"
                min="0"
                step="0.0001"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 ">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Status
          </Label>
          <span className="text-xs text-muted-foreground">Step 4 of 4</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setFormData((prev: any) => ({ ...prev, status: option.id }));
                updateDateLimits(option.id as FinancialGoalTransactionStatus);
              }}
              className={cn(
                "relative p-3 rounded-xl border text-center transition-all duration-200",
                "hover:shadow-sm",
                formData.status === option.id
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
          value={formData.description ?? ""}
          onChange={(e) => {
            setFormData((prev: any) => ({ ...prev, description: e.target.value }));
          }}
          className="min-h-24 bg-input border-border resize-none placeholder:text-muted-foreground/50"
        />
      </div>

      <Checkbox
        checked={formData.is_monthly_payment}
        onChange={(value) => {
          setFormData((prev) => ({ ...prev, is_monthly_payment: value }));
        }}
        label="Pagamento mensal"
      />

      <p className="text-center text-xs text-muted-foreground">
        Valor a abater da dívida:{" "}
        {parseFloat(formData.amount ?? "0") -
          parseFloat(formData.amount ?? "0") * (parseFloat(formData.interest_rate ?? "0") / 100)}
        .
      </p>

      <SubmitFormButton
        isSubmitting={isSubmitting}
        isDisable={!formData.debt_id || !formData.account_id || !formData.amount}
      />

      {/* Form Helper */}
      <p className="text-center text-xs text-muted-foreground">
        All payments are securely processed and recorded instantly.
      </p>
    </form>
  );
}

export default DebtPaymentForm;
