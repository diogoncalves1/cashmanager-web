"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calculator, Calendar, DollarSign, FileText, Percent, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/ui/button/AppLink";
import { useDebtForm } from "./hooks/useDebtForm";
import { useTranslations } from "next-intl";
import { TransactionDatePicker } from "../transactions/TransactionDatePicker";
import { useToast } from "@/hooks/useToast";

interface FormData {
  name: string;
  description: string;
  total_amount: string;
  monthly_amount: string;
  interest_rate: string;
  currency_id: string;
  start_date: string;
  due_date: string;
  months: string;
}

interface FormErrors {
  name?: string;
  total_amount?: string;
  monthly_amount?: string;
  start_date?: string;
  due_date?: string;
  months?: string;
}
type Props = {
  id?: string;
};

export default function DebtForm({ id }: Props) {
  const { toast } = useToast();
  const {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    loadingCurrencies,
    currencies,
    updateDateLimits,
    dateLimits,
  } = useDebtForm(id);

  const t = useTranslations("DEBTS");

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const currencySymbol = currencies.find((c) => c.id === formData.currency_id)?.symbol || "$";

  const calculations = useMemo(() => {
    if (formData.total_amount == "")
      return {
        remaining: 0,
        estimatedMonths: 0,
        monthly: 0,
        estimatedTotal: 0,
      };

    const total = parseFloat(formData.total_amount) || 0;

    const interestRate = formData.interest_rate;

    const months = parseInt(formData.months == "" ? "1" : formData.months);
    let monthly = 0;

    if (interestRate == "" || interestRate == "0") {
      monthly = total / months;
    } else {
      const monthlyInterestRate = parseFloat(interestRate) / 12 / 100;

      const factor = Math.pow(1 + monthlyInterestRate, months);

      monthly = total * ((monthlyInterestRate * factor) / (factor - 1));
    }

    const estimatedTotal = monthly * months;
    const remaining = Math.max(0, estimatedTotal);
    const estimatedMonths = monthly > 0 ? Math.ceil(remaining / monthly) : 0;

    return {
      remaining,
      estimatedMonths,
      monthly,
      estimatedTotal,
    };
  }, [formData.total_amount, formData.interest_rate, formData.months]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateField = (field: string): boolean => {
    let error: string | undefined;

    switch (field) {
      case "name":
        if (!formData.name.trim()) {
          error = "Debt name is required";
        } else if (formData.name.length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "totalAmount":
        if (!formData.total_amount) {
          error = "Total amount is required";
        } else if (parseFloat(formData.total_amount) <= 0) {
          error = "Amount must be greater than 0";
        }
        break;
      case "monthlyAmount":
        if (!formData.monthly_amount) {
          error = "Monthly payment is required";
        } else if (parseFloat(formData.monthly_amount) <= 0) {
          error = "Payment must be greater than 0";
        }
        break;
      case "startDate":
        if (!formData.start_date) {
          error = "Start date is required";
        }
        break;
      case "dueDate":
        if (!formData.due_date) {
          error = "Due date is required";
        } else if (formData.start_date && formData.due_date < formData.start_date) {
          error = "Due date must be after start date";
        }
        break;
      case "months":
        if (!formData.months) {
          error = "Months is required";
        } else if (formData.months && parseInt(formData.months) < 1) {
          error = "O número de meses tem que ser válido";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const fields = ["name", "totalAmount", "monthlyAmount", "startDate", "dueDate", "months"];
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    setTouched(fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    return isValid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const res = await handleSubmit();

    toast({ description: res.message });
  };

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      parseFloat(formData.total_amount) > 0 &&
      parseFloat(formData.monthly_amount) > 0 &&
      formData.currency_id !== "" &&
      formData.start_date &&
      formData.due_date &&
      formData.due_date >= formData.start_date &&
      formData.months &&
      parseInt(formData.months) > 0
    );
  }, [formData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencies.find((c) => c.id == formData.currency_id)?.code ?? "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                <CardTitle className="text-lg">{t("BASIC_INFORMATION")}</CardTitle>
              </div>
              <CardDescription>{t("BASIC_INFORMATION_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("DEBT_NAME")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t("DEBT_NAME_PLACEHOLDER")}
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={cn(
                    touched.name &&
                      errors.name &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("DESCRIPTION")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("DESCRIPTION_PLACEHOLDER")}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">{t("DESCRIPTION_TEXT")}</p>
              </div>

              <div className="grid gap-4 grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    {t("CURRENCY")} <span className="text-destructive">*</span>
                  </Label>
                  {!loadingCurrencies ? (
                    <Select
                      value={formData.currency_id}
                      onValueChange={(e: string) => {
                        setFormData((prev) => ({ ...prev, currency_id: e }));
                      }}
                    >
                      <SelectTrigger className="h-14 bg-input border-border text-foreground">
                        <SelectValue placeholder={t("CHOOSE_A_CURRENCY")} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {!loadingCurrencies &&
                          currencies?.map((currency) => (
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
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-muted-foreground" />
                <CardTitle className="text-lg">{t("TIMELINE")}</CardTitle>
              </div>
              <CardDescription>{t("TIMELINE_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    {t("START_DATE")} <span className="text-destructive">*</span>
                  </Label>
                  <TransactionDatePicker
                    date={formData.start_date}
                    onChangeDate={(newDate: string) => {
                      setFormData((p) => ({ ...p, start_date: newDate }));
                      updateDateLimits({ due_date: formData.due_date, start_date: newDate });
                    }}
                    dateLimits={dateLimits.start_date}
                  />

                  {touched.startDate && errors.start_date && (
                    <p className="text-sm text-destructive">{errors.start_date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">
                    {t("DUE_DATE")} <span className="text-destructive">*</span>
                  </Label>
                  <TransactionDatePicker
                    date={formData.due_date}
                    onChangeDate={(newDate: string) => {
                      setFormData((p) => ({ ...p, due_date: newDate }));
                      updateDateLimits({ due_date: newDate, start_date: formData.start_date });
                    }}
                    dateLimits={dateLimits.due_date}
                  />
                  {touched.dueDate && errors.due_date && (
                    <p className="text-sm text-destructive">{errors.due_date}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="size-5 text-muted-foreground" />
                <CardTitle className="text-lg">{t("FINANCIAL_DETAILS")}</CardTitle>
              </div>
              <CardDescription>{t("FINANCIAL_DETAILS_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">
                    {t("TOTAL_AMOUNT")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="totalAmount"
                      type="number"
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                      value={formData.total_amount}
                      onChange={(e) => updateField("total_amount", e.target.value)}
                      className={cn(
                        "pl-8",
                        touched.totalAmount &&
                          errors.total_amount &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  {touched.totalAmount && errors.total_amount && (
                    <p className="text-sm text-destructive">{errors.total_amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyAmount">
                    {t("MONTHLY_PAYMENT")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="monthlyAmount"
                      type="number"
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                      value={formData.monthly_amount}
                      onChange={(e) => updateField("monthly_amount", e.target.value)}
                      className={cn(
                        "pl-8",
                        touched.monthlyAmount &&
                          errors.monthly_amount &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  {touched.monthlyAmount && errors.monthly_amount && (
                    <p className="text-sm text-destructive">{errors.monthly_amount}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="months">
                    {t("TOTAL_MONTHS")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="months"
                    type="number"
                    placeholder={t("TOTAL_MONTHS_PLACEHOLDER")}
                    value={formData.months}
                    onChange={(e) => updateField("months", e.target.value)}
                  />
                  {touched.months && errors.months && (
                    <p className="text-sm text-destructive">{errors.months}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">{t("ANNUAL_INTEREST_RATE")}</Label>
                  <div className="relative">
                    <Input
                      id="interestRate"
                      type="number"
                      placeholder="0.00"
                      min={0}
                      max={100}
                      step={0.01}
                      value={formData.interest_rate}
                      onChange={(e) => updateField("interest_rate", e.target.value)}
                      className="pr-8"
                    />
                    <Percent className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("ANNUAL_INTEREST_RATE_TEXT")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-muted-foreground" />
                <CardTitle className="text-lg">{t("SUMMARY")}</CardTitle>
              </div>
              <CardDescription>{t("SUMMARY_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calculated Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("TOTAL_AMOUNT")}</span>
                  <span className="font-semibold">
                    {formatCurrency(calculations.estimatedTotal)}
                  </span>
                </div>

                <div className="h-px bg-border" />
              </div>

              {/* Estimated Time */}
              {calculations.estimatedMonths > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    <span className="text-sm font-medium">{t("ESTIMATED_PAYOFF")}</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {calculations.estimatedMonths}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {calculations.estimatedMonths === 1 ? t("MONTH") : t("MONTHS")}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("BASED_ON")} {formatCurrency(calculations.monthly || 0)}/{t("MONTH")}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                  {id
                    ? isSubmitting
                      ? t("SAVING")
                      : t("SAVE")
                    : isSubmitting
                      ? t("CREATING")
                      : t("CREATE_DEBT")}
                </Button>

                <AppLink
                  path="/debts"
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {t("CANCEL")}
                </AppLink>
              </div>

              {!isFormValid && (
                <p className="text-center text-xs text-muted-foreground">
                  {id
                    ? t("PLEASE_FILL_REQUIRED_FIELDS_EDIT")
                    : t("PLEASE_FILL_REQUIRED_FIELDS_CREATE")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
