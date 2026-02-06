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
import LoadingToast from "@/components/swal/LoadingToast";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { DebtDatePicker } from "./DebtDatePicker";

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
}
type Props = {
  id?: string;
};

export default function DebtForm({ id }: Props) {
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
    const total = parseFloat(formData.total_amount) || 0;
    const monthly = parseFloat(formData.monthly_amount) || 0;
    const remaining = Math.max(0, total);
    const estimatedMonths = monthly > 0 ? Math.ceil(remaining / monthly) : 0;

    return {
      remaining,
      estimatedMonths,
    };
  }, [formData.total_amount, formData.monthly_amount]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
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
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const fields = ["name", "totalAmount", "monthlyAmount", "startDate", "dueDate"];
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

    LoadingToast({
      title: t("CREATING"),
      message: "A criar a sua transação...",
    });

    const res = await handleSubmit();

    SwalToast({
      message: res.message,
      icon: res.success ? "success" : "error",
    });
  };

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      parseFloat(formData.total_amount) > 0 &&
      parseFloat(formData.monthly_amount) > 0 &&
      formData.currency_id !== "" &&
      formData.start_date &&
      formData.due_date &&
      formData.due_date >= formData.start_date
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
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </div>
              <CardDescription>Enter the name and description of your debt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Debt Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Home Mortgage, Car Loan, Student Loan"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about this debt..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Add notes or context about this debt.
                </p>
              </div>

              <div className="grid gap-4 grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    Currency <span className="text-destructive">*</span>
                  </Label>
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
                <CardTitle className="text-lg">Timeline</CardTitle>
              </div>
              <CardDescription>Set the start and due dates for this debt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <DebtDatePicker
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
                    Due Date <span className="text-destructive">*</span>
                  </Label>
                  <DebtDatePicker
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
                <CardTitle className="text-lg">Financial Details</CardTitle>
              </div>
              <CardDescription>Set the amounts and payment structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">
                    Total Amount <span className="text-destructive">*</span>
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
                      onBlur={() => handleBlur("total_amount")}
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
                    Monthly Payment <span className="text-destructive">*</span>
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
                      onBlur={() => handleBlur("monthly_amount")}
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
                  <Label htmlFor="months">Total Months</Label>
                  <Input
                    id="months"
                    type="number"
                    placeholder="Auto-calculated or enter manually"
                    min={0}
                    value={formData.months}
                    onChange={(e) => updateField("months", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Total duration in months.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Interest Rate</Label>
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
                  <p className="text-xs text-muted-foreground">Optional. Annual interest rate.</p>
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
                <CardTitle className="text-lg">Summary</CardTitle>
              </div>
              <CardDescription>Calculated values based on your input</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calculated Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">
                    {formatCurrency(parseFloat(formData.total_amount) || 0)}
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Remaining Balance</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(calculations.remaining)}
                  </span>
                </div>
              </div>

              {/* Estimated Time */}
              {calculations.estimatedMonths > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    <span className="text-sm font-medium">Estimated Payoff</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {calculations.estimatedMonths}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {calculations.estimatedMonths === 1 ? "month" : "months"}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on {formatCurrency(parseFloat(formData.monthly_amount) || 0)}/month
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Debt"}
                </Button>

                <AppLink
                  path="/debts"
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Cancel
                </AppLink>
              </div>

              {!isFormValid && (
                <p className="text-center text-xs text-muted-foreground">
                  Please fill in all required fields to create the debt.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
