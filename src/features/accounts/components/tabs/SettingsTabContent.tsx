"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/shared/hooks/useToast";
import { Account, getAccountTypes } from "@/features/accounts/types";
import DeleteAccountDialog from "@/features/accounts/components/dialogs/DeleteAccountDialog";
import { useAccountForm } from "@/features/accounts/hooks/useAccountForm";
import { Currency } from "@/shared/types/currency";
import { useAccountDetailsContext } from "@/features/accounts/state/account-details.context";
import { useTranslations } from "next-intl";

interface SettingsTabContentProps {
  account: Account;
  isLoading?: boolean;
}

export function SettingsTabContent({ account, isLoading }: SettingsTabContentProps) {
  const t = useTranslations("ACCOUNTS");
  const { setLoadCounter } = useAccountDetailsContext();
  const { toast } = useToast();
  const accountTypes = getAccountTypes(t);

  const {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    isLoadingAccount,
    loadingCurrencies,
    currencies,
  } = useAccountForm(account.id, account);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleSave = async () => {
    const res = await handleSubmit();
    if (res.success) {
      setLoadCounter((prev) => prev + 1);
      toast({
        description: res.message,
      });
    }
  };

  if (isLoading || isLoadingAccount) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i} className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {account.actions?.edit && (
        <>
          {/* General Info */}
          <Card className="rounded-2xl border-0 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("GENERAL_INFORMATION")}</CardTitle>
              <CardDescription>{t("GENERAL_INFORMATION_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="acc-name">{t("ACCOUNT_NAME")}</Label>
                <Input
                  id="acc-name"
                  value={formData.name}
                  placeholder={"ACCOUNT_NAME_EG"}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>{t("ACCOUNT_TYPE")}</Label>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("CURRENCY")}</Label>
                  </div>
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
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="rounded-2xl border-0 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("PREFERENCES")}</CardTitle>
              <CardDescription>{t("PREFRENCES_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("ACTIVE_ACCOUNT")}</p>
                  <p className="text-sm text-muted-foreground">{t("ACTIVE_ACCOUNT_TEXT")}</p>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(e) => {
                    setFormData((prev) => ({ ...prev, active: e }));
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSubmitting} className="gap-2">
              <Save className="size-4" />
              {isSubmitting ? t("SAVING") : t("SAVE_CHANGES")}
            </Button>
          </div>
        </>
      )}

      {/* Danger Zone */}
      {account.actions?.destroy && (
        <>
          <Card className="rounded-2xl border-0 shadow-sm border-destructive/20 bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive" />
                <CardTitle className="text-base font-semibold text-destructive">
                  {t("DANGER_ZONE")}
                </CardTitle>
              </div>
              <CardDescription>{t("DANGER_ZONE_TEXT")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("DELETE_THIS_ACCOUNT")}</p>
                  <p className="text-sm text-muted-foreground">{t("DELETE_THIS_ACCOUNT_TEXT")}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  className="gap-2 shrink-0"
                >
                  <Trash2 className="size-3.5" />
                  {t("DELETE_ACCOUNT")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <DeleteAccountDialog
            isOpen={isDeleteOpen}
            setIsDeleteOpen={setIsDeleteOpen}
            account={account}
            back={true}
          />
        </>
      )}
    </div>
  );
}
