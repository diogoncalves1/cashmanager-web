"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AccountFormData } from "@/lib/types";
import { Account, getAccountTypes } from "@/models/account";
import { useAccountForm } from "@/components/form/accounts/hooks/useAccountForm";
import { toast } from "@/hooks/useToast";
import { Currency } from "@/models/currency";
import { useTranslations } from "next-intl";

interface FormAccountDialogProps {
  id?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  account?: Account;
  mutate?: () => void;
}

export function FormAccountDialog({
  id,
  isOpen,
  setIsOpen,
  account,
  mutate,
}: FormAccountDialogProps & {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  account?: Account;
}) {
  const t = useTranslations("ACCOUNTS");
  const accountTypes = getAccountTypes(t);
  const {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    isLoadingAccount,
    loadingCurrencies,
    currencies,
  } = useAccountForm(id, account);

  const [errors, setErrors] = useState<Partial<Record<keyof AccountFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    handleSave();
    setErrors({});
  };

  const handleSave = async () => {
    const res = await handleSubmit();
    if (res.success) {
      toast({
        description: res.message,
      });
      if (mutate) mutate();
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Add a new financial account to track your balance and transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Account Type</Label>
                {!isLoadingAccount ? (
                  <Select
                    value={formData.type}
                    onValueChange={(e: string) => {
                      setFormData((prev) => ({ ...prev, type: e }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {accountTypes?.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="py-3 cursor-pointer focus:bg-accent"
                        >
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="font-medium">{type.label}</span>
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

              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                {!loadingCurrencies ? (
                  <Select
                    value={formData.currency_id}
                    onValueChange={(e: string) => {
                      setFormData((prev) => ({ ...prev, currency_id: e }));
                    }}
                  >
                    <SelectTrigger>
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
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Account
                </Label>
                <p className="text-xs text-muted-foreground">
                  Active accounts are included in balance totals
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
