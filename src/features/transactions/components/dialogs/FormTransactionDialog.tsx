"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TransactionStatus, TransactionType } from "@/features/transactions";
import { useTransactionForm } from "@/features/transactions/server";
import { useToast } from "@/shared/hooks/useToast";
import { AccountBasic, accountTypeConfig } from "@/features/accounts";
import { Category, iconMap } from "@/shared/types/category";
import { DatePicker } from "@/shared/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { useEffect, useState } from "react";
import CustomSelect from "@/shared/ui/custom-select";
import { cn } from "@/shared/utils";

type TransactionDialogProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  id?: string;
  mutate?: () => void;
  accountId?: string;
};

export const FormTransactionDialog = ({
  isOpen,
  setIsOpen,
  mutate,
  id,
  accountId,
}: TransactionDialogProps) => {
  const t = useTranslations("TRANSACTIONS");
  const {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    isLoadingTransaction,
    isLoadingCategories,
    isLoadingAccounts,
    categories,
    accounts,
  } = useTransactionForm(id, accountId, isOpen);
  const { toast } = useToast();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((p) => (p === key ? null : key));

  useEffect(() => {
    if (isLoadingAccounts && !id) return;
    setFormData((prev) => ({
      ...prev,
      ...(accountId ? { account_id: accountId } : {}),
    }));
  }, [formData.account_id, setFormData, accountId, isLoadingAccounts, id]);

  function reset() {
    setFormData({
      amount: undefined,
      account_id: undefined,
      type: "revenue",
      status: "completed",
      category_id: undefined,
      date: "",
      description: "",
    });
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.account_id ||
      !formData.amount ||
      !formData.date ||
      !formData.category_id ||
      !formData.type ||
      !formData.status
    )
      return;

    const result = await handleSubmit();
    if (mutate) mutate();
    if (result.success) reset();
    toast({
      description: result.message,
    });
    setIsOpen(false);
  };

  if (isLoadingTransaction) {
    return <div className="h-96 animate-pulse bg-gray-100 rounded" />;
  }

  if (!isLoadingAccounts && !id && isOpen && accounts?.length == 0) {
    setIsOpen(false);
    SwalToast({ message: t("NO_ACCOUNTS_AVAILABLE"), icon: "warning" });
    return <></>;
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{id ? t("EDIT_TRANSACTION") : t("NEW_TRANSACTION")}</DialogTitle>
            <DialogDescription>
              {id ? t("EDIT_TRANSACTION_FORM_DIALOG_TEXT") : t("NEW_TRANSACTION_FORM_DIALOG_TEXT")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-4">
            {!id && !accountId && (
              <div className="grid gap-1.5">
                <Label htmlFor="tx-account">{t("ACCOUNT")}</Label>
                {!isLoadingAccounts ? (
                  <CustomSelect
                    value={formData.account_id ?? ""}
                    placeholder={t("CHOOSE_ACCOUNT")}
                    className="w-full"
                    options={
                      accounts?.map((a: AccountBasic) => {
                        const config = accountTypeConfig[a.typeOrg];
                        const Icon = config.icon;

                        return {
                          label: a.name,
                          value: a.id,
                          icon: (
                            <Icon className={cn("size-5", config.className)} strokeWidth={1.75} />
                          ),
                        };
                      }) ?? []
                    }
                    onSelect={(v) =>
                      setFormData((prev) => ({ ...prev, account_id: v || undefined }))
                    }
                    open={openDropdown === "account"}
                    onToggle={() => toggle("account")}
                  />
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="h-12 rounded bg-muted animate-pulse" />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="tx-amount">{t("AMOUNT")}</Label>
                <Input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="$ 0.00"
                  value={(formData.amount as number) ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || undefined,
                    }))
                  }
                  required
                />
              </div>
              {!id && (
                <div className="grid gap-1.5">
                  <Label htmlFor="tx-type">{t("TYPE")}</Label>
                  <CustomSelect
                    placeholder={t("CHOOSE_TYPE")}
                    value={formData.type}
                    onSelect={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e as TransactionType,
                        category_id: undefined,
                      }))
                    }
                    options={[
                      { label: t("INCOME"), value: "revenue" },
                      { label: t("EXPENSE"), value: "expense" },
                    ]}
                    open={openDropdown === "type"}
                    onToggle={() => toggle("type")}
                    className="w-full"
                  />
                </div>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="tx-category">{t("CATEGORY")}</Label>
                {!isLoadingCategories ? (
                  <CustomSelect
                    value={formData.category_id ?? ""}
                    placeholder={t("CHOOSE_CATEGORY")}
                    className="w-full"
                    options={
                      categories.data.map((c: Category) => {
                        const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Circle;

                        return {
                          label: c.name,
                          value: c.id,
                          icon: <Icon className="size-5" style={{ color: c.color }} />,
                        };
                      }) ?? []
                    }
                    onSelect={(id: string) => setFormData((p) => ({ ...p, category_id: id }))}
                    open={openDropdown === "category"}
                    onToggle={() => toggle("category")}
                  />
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="h-12 rounded bg-muted animate-pulse" />
                  </div>
                )}
              </div>
              {!id && (
                <div className="grid gap-1.5">
                  <Label htmlFor="tx-status">{t("STATUS")}</Label>
                  <CustomSelect
                    placeholder={t("CHOOSE_STATUS")}
                    value={formData.status}
                    onSelect={(status) => {
                      setFormData((prev) => ({ ...prev, status: status as TransactionStatus }));
                      updateDateLimits(status as TransactionStatus);
                    }}
                    options={[
                      { label: t("COMPLETED"), value: "completed" },
                      { label: t("PENDING"), value: "pending" },
                    ]}
                    open={openDropdown === "status"}
                    onToggle={() => toggle("status")}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tx-date">{t("DATE")}</Label>
              <DatePicker
                className="w-full"
                dateLimits={dateLimits}
                date={formData.date}
                onChangeDate={(newDate) => setFormData((p) => ({ ...p, date: newDate }))}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tx-description">{t("DESCRIPTION")}</Label>
              <Textarea
                id="tx-description"
                placeholder={t("WHAT_WAS_THIS_FOR")}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="app_cancel" size="lg" onClick={() => setIsOpen(false)}>
              {t("CANCEL")}
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="app_submit"
              disabled={
                !formData.account_id ||
                !formData.amount ||
                !formData.date ||
                !formData.category_id ||
                !formData.type ||
                !formData.status ||
                isSubmitting
              }
            >
              {id ? t("SAVE") : t("CREATE")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
