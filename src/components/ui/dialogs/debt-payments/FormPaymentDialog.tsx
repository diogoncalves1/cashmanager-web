import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionStatus } from "@/features/transactions/types";
import { useToast } from "@/hooks/useToast";
import { AccountBasic } from "@/features/accounts/types";
import { DatePicker } from "@/shared/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { useDebtPaymentForm } from "@/components/form/debt-payments/hooks/useDebtPaymentForm";
import Checkbox from "@/components/form/input/Checkbox";
import { useEffect } from "react";

type FormPaymentDialogProps = {
  id?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  mutate?: () => void;
  debtId?: string;
};

const FormPaymentDialog = ({ id, setIsOpen, isOpen, mutate, debtId }: FormPaymentDialogProps) => {
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
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{id ? t("EDIT_PAYMENT") : t("NEW_PAYMENT")}</DialogTitle>
            <DialogDescription>
              {id ? t("EDIT_PAYMENT_FORM_DIALOG_TEXT") : t("NEW_PAYMENT_FORM_DIALOG_TEXT")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-4">
            {!id && (
              <div className="grid gap-1.5">
                <Label htmlFor="tx-account">{t("ACCOUNT")}</Label>
                {!loadingAccouts ? (
                  <Select
                    value={formData.account_id}
                    onValueChange={(id: string) => setFormData((p) => ({ ...p, account_id: id }))}
                  >
                    <SelectTrigger id="tx-account">
                      <SelectValue placeholder={t("SELECT_ACCOUNT")} />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map((a: AccountBasic) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
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
            )}
            {!id && !debtId && (
              <div className="grid gap-1.5">
                <Label htmlFor="tx-debt">{t("DEBT")}</Label>
                {!loadingDebts ? (
                  <Select
                    value={formData.debt_id}
                    onValueChange={(id: string) => setFormData((p) => ({ ...p, debt_id: id }))}
                  >
                    <SelectTrigger id="tx-debt">
                      <SelectValue placeholder={t("SELECT_DEBT")} />
                    </SelectTrigger>
                    <SelectContent>
                      {debts?.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
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
                  value={(formData.amount as string) ?? ""}
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
                <Label htmlFor="interest_rate" className="text-sm text-muted-foreground">
                  {t("INTEREST_RATE")}
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
                      setFormData((prev) => ({ ...prev, interest_rate: e.target.value }));
                    }}
                    className="pl-12 text-lg placeholder:text-muted-foreground/50"
                    min="0"
                    step="0.0001"
                  />
                </div>
              </div>
            </div>

            {!id && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="tx-status">{t("STATUS")}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(status: TransactionStatus) => {
                      setFormData((prev) => ({ ...prev, status: status }));
                      updateDateLimits(status);
                    }}
                  >
                    <SelectTrigger id="tx-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">{t("COMPLETED")}</SelectItem>
                      <SelectItem value="pending">{t("PENDING")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="tx-date">{t("DATE")}</Label>
              <DatePicker
                dateLimits={dateLimits}
                date={formData.date}
                onChangeDate={(newDate) => setFormData((p) => ({ ...p, date: newDate }))}
              />
            </div>

            <div className="grid gap-1.5 mb-3">
              <Label htmlFor="tx-description">{t("DESCRIPTION")}</Label>
              <Textarea
                id="tx-description"
                placeholder={t("WHAT_WAS_THIS_FOR")}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <Checkbox
            checked={Boolean(formData.is_monthly_payment)}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, is_monthly_payment: value }));
            }}
            label="Pagamento mensal"
          />

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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

export default FormPaymentDialog;
