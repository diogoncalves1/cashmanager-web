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
import { Switch } from "@/components/ui/switch";
import {
  Account,
  getAccountTypes,
  AccountFormData,
  accountTypeConfig,
  AccountType,
} from "@/features/accounts";
import { useAccountForm } from "@/features/accounts/server";
import { toast } from "@/shared/hooks/useToast";
import { Currency } from "@/shared/types/currency";
import { useTranslations } from "next-intl";
import CustomSelect from "@/shared/ui/custom-select";
import { cn } from "@/shared/utils";
import { Power } from "lucide-react";

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((p) => (p === key ? null : key));

  const validate = () => {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = t("NAME_IS_REQUIRED");
    if (!formData.currency_id || !formData.currency_id.trim())
      newErrors.currency = t("CURRENCY_IS_REQUIRED");
    if (!formData.type.trim()) newErrors.type = t("TYPE_IS_REQUIRED");
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
      <DialogContent className="sm:min-w-xl bg-white">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{id ? t("EDIT_ACCOUNT") : t("CREATE_NEW_ACCOUNT")}</DialogTitle>
            <DialogDescription>
              {id ? t("EDIT_ACCOUNT_TEXT") : t("CREATE_ACCOUNT_TEXT")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-1">
                <Label htmlFor="name">
                  {t("ACCOUNT_NAME")} <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t("ACCOUNT_NAME_EG")}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-2 col-span-1">
                <Label htmlFor="type">
                  {t("ACCOUNT_TYPE")} <span className="text-error-500">*</span>
                </Label>
                {!isLoadingAccount ? (
                  <CustomSelect
                    value={formData.type}
                    placeholder={t("CHOOSE_A_TYPE")}
                    className="w-full"
                    options={
                      accountTypes?.map((type) => {
                        const config = accountTypeConfig[type.value as AccountType];
                        const Icon = config.icon;

                        return {
                          label: type.label,
                          value: type.value,
                          icon: (
                            <Icon className={cn("size-5", config.className)} strokeWidth={1.75} />
                          ),
                        };
                      }) ?? []
                    }
                    onSelect={(e: string) => {
                      setFormData((prev) => ({ ...prev, type: e }));
                    }}
                    open={openDropdown === "type"}
                    onToggle={() => toggle("type")}
                  />
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="h-8 rounded bg-muted animate-pulse" />
                  </div>
                )}
                {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">
                {t("CURRENCY")} <span className="text-error-500">*</span>
              </Label>
              {!loadingCurrencies ? (
                <CustomSelect
                  value={formData.currency_id ?? ""}
                  placeholder={t("CHOOSE_A_CURRENCY")}
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
                  onSelect={(e: string) => {
                    setFormData((prev) => ({ ...prev, currency_id: e }));
                  }}
                  open={openDropdown === "currency"}
                  onToggle={() => toggle("currency")}
                />
              ) : (
                <div className="p-2 space-y-2">
                  <div className="h-8 rounded bg-muted animate-pulse" />
                </div>
              )}
              {errors.currency && <p className="text-xs text-destructive">{errors.currency}</p>}
            </div>

            <div
              className={cn(
                "flex items-center justify-between rounded-md border p-4 transition-colors duration-300",
                formData.active ? "border-accent/30 bg-accent/5" : "border-border bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
                    formData.active
                      ? "bg-accent/15 text-accent"
                      : "bg-gray-200 text-gray-400 dark:bg-gray-800"
                  )}
                >
                  <Power className="size-4" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    {t("ACTIVE_ACCOUNT")}
                  </Label>
                  <p className="text-xs text-muted-foreground">{t("ACTIVE_ACCOUNT_TEXT")}</p>
                </div>
              </div>
              <Switch
                id="isActive"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              {errors.isActive && <p className="text-xs text-destructive">{errors.isActive}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="app_cancel" size="lg" onClick={() => setIsOpen(false)}>
              {t("CANCEL")}
            </Button>
            <Button
              disabled={!formData.currency_id || !formData.name || !formData.type || isSubmitting}
              size="lg"
              variant="app_gray"
              type="submit"
            >
              {id
                ? isSubmitting
                  ? t("SAVING")
                  : t("SAVE_CHANGES")
                : isSubmitting
                  ? t("CREATING_ACCOUNT")
                  : t("CREATE_ACCOUNT")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
