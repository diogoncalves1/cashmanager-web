"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/shared/hooks/useToast";
import { AccountBasic } from "@/features/accounts";
import { DatePicker } from "@/shared/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { DebtPaymentStatus } from "@/features/debt-payments";
import { useDebtPaymentForm } from "@/features/debt-payments/server";
import Checkbox from "@/components/form/input/Checkbox";
import CustomSelect from "@/shared/ui/custom-select";
import { CreditCard, Landmark, Percent } from "lucide-react";

type FormPaymentDialogProps = {
  id?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  mutate?: () => void;
  debtId?: string;
};

export const FormPaymentDialog = ({
  id,
  setIsOpen,
  isOpen,
  mutate,
  debtId,
}: FormPaymentDialogProps) => {
  const t = useTranslations("DEBT_PAYMENTS");
  const {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    isLoadingPayment,
    loadingAccouts,
    accounts,
    debts,
    loadingDebts,
  } = useDebtPaymentForm(id, debtId, isOpen);
  const { toast } = useToast();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key));
  const isEditing = Boolean(id);

  function reset() {
    setFormData({
      amount: undefined,
      account_id: undefined,
      debt_id: undefined,
      status: "completed",
      is_monthly_payment: true,
      date: "",
      description: "",
    });
  }

  useEffect(() => {
    if (loadingDebts && !id) return;
    const debt = debts.find((debt) => debt.id == formData.debt_id);
    setFormData((prev) => ({
      ...prev,
      interest_rate: String(((debt?.interestRate ?? 0) / 12).toFixed(4)),
      amount: String(debt?.monthlyAmount),
      ...(debtId ? { debt_id: debtId } : {}),
    }));
  }, [formData.debt_id, debts, setFormData, debtId, loadingDebts, id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.account_id ||
      !formData.amount ||
      !formData.date ||
      !formData.debt_id ||
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

  if (isLoadingPayment) {
    return <div className="" />;
  }

  if (!loadingAccouts && !id && accounts?.length == 0 && isOpen) {
    SwalToast({ message: t("NO_ACCOUNTS_AVAILABLE"), icon: "warning" });
    setIsOpen(false);
    return <></>;
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={onSubmit}>
          <DialogHeader className="pr-8">
            <DialogTitle className="text-xl">
              {id ? t("EDIT_PAYMENT") : t("NEW_PAYMENT")}
            </DialogTitle>
            <DialogDescription className="max-w-lg">
              {id ? t("EDIT_PAYMENT_FORM_DIALOG_TEXT") : t("NEW_PAYMENT_FORM_DIALOG_TEXT")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            {isEditing ? (
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="tx-date">{t("DATE")}</Label>
                  <DatePicker
                    className="w-full"
                    dateLimits={dateLimits}
                    date={formData.date}
                    onChangeDate={(newDate) => setFormData((p) => ({ ...p, date: newDate }))}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="tx-amount">{t("AMOUNT")}</Label>
                    <Input
                      id="tx-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="$ 0.00"
                      value={(formData.amount as string) ?? ""}
                      leftIcon={<CreditCard className="size-4" />}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value || undefined,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="interest_rate">{t("INTEREST_RATE")}</Label>
                    <Input
                      id="interest_rate"
                      type="number"
                      placeholder="0.00"
                      value={formData.interest_rate ?? ""}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, interest_rate: e.target.value }));
                      }}
                      leftIcon={<Percent className="size-4" />}
                      min="0"
                      step="0.0001"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="tx-account">{t("ACCOUNT")}</Label>
                    {!loadingAccouts ? (
                      <CustomSelect
                        value={formData.account_id ?? ""}
                        placeholder={t("SELECT_ACCOUNT")}
                        className="w-full"
                        options={
                          accounts?.map((account: AccountBasic) => ({
                            label: account.name,
                            value: account.id,
                            keywords: account.type,
                            icon: <Landmark className="size-4 text-muted-foreground" />,
                          })) ?? []
                        }
                        open={openDropdown === "account"}
                        onToggle={() => toggle("account")}
                        onSelect={(accountId: string) =>
                          setFormData((prev) => ({ ...prev, account_id: accountId }))
                        }
                      />
                    ) : (
                      <div className="p-2 space-y-2">
                        <div className="h-8 rounded bg-muted animate-pulse" />
                      </div>
                    )}
                  </div>

                  {!debtId && (
                    <div className="grid gap-1.5">
                      <Label htmlFor="tx-debt">{t("DEBT")}</Label>
                      {!loadingDebts ? (
                        <CustomSelect
                          value={formData.debt_id ?? ""}
                          placeholder={t("SELECT_DEBT")}
                          className="w-full"
                          options={
                            debts?.map((debt) => ({
                              label: debt.name,
                              value: debt.id,
                              keywords: `${debt.monthlyAmount} ${debt.interestRate}`,
                              icon: <CreditCard className="size-4 text-muted-foreground" />,
                            })) ?? []
                          }
                          open={openDropdown === "debt"}
                          onToggle={() => toggle("debt")}
                          onSelect={(selectedDebtId: string) =>
                            setFormData((prev) => ({ ...prev, debt_id: selectedDebtId }))
                          }
                        />
                      ) : (
                        <div className="p-2 space-y-2">
                          <div className="h-8 rounded bg-muted animate-pulse" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-1.5">
                    <Label htmlFor="tx-status">{t("STATUS")}</Label>
                    <CustomSelect
                      value={formData.status ?? ""}
                      placeholder={t("STATUS")}
                      className="w-full"
                      options={[
                        { value: "completed", label: t("COMPLETED") },
                        { value: "pending", label: t("PENDING") },
                      ]}
                      open={openDropdown === "status"}
                      onToggle={() => toggle("status")}
                      onSelect={(status: string) => {
                        const selectedStatus = status as DebtPaymentStatus;
                        setFormData((prev) => ({ ...prev, status: selectedStatus }));
                        updateDateLimits(selectedStatus);
                      }}
                    />
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="tx-amount">{t("AMOUNT")}</Label>
                    <Input
                      id="tx-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="$ 0.00"
                      value={(formData.amount as string) ?? ""}
                      leftIcon={<CreditCard className="size-4" />}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value || undefined,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="interest_rate">{t("INTEREST_RATE")}</Label>
                    <Input
                      id="interest_rate"
                      type="number"
                      placeholder="0.00"
                      value={formData.interest_rate ?? ""}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, interest_rate: e.target.value }));
                      }}
                      leftIcon={<Percent className="size-4" />}
                      min="0"
                      step="0.0001"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="tx-description">{t("DESCRIPTION")}</Label>
              <Textarea
                id="tx-description"
                placeholder={t("WHAT_WAS_THIS_FOR")}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-24 resize-none"
              />
            </div>

            <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900/60">
              <Checkbox
                checked={Boolean(formData.is_monthly_payment)}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, is_monthly_payment: value }));
                }}
                label={t("MONTHLY_PAYMENT")}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="app_cancel" size="lg" onClick={() => setIsOpen(false)}>
              {t("CANCEL")}
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.debt_id ||
                !formData.account_id ||
                !formData.amount ||
                !formData.date ||
                !formData.status ||
                isSubmitting
              }
              size="lg"
              variant="app_submit"
            >
              {id
                ? isSubmitting
                  ? t("SAVING")
                  : t("SAVE")
                : isSubmitting
                  ? t("CREATING")
                  : t("CREATE")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
