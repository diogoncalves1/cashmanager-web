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
import { TransactionStatus } from "@/models/transaction";
import { useToast } from "@/hooks/useToast";
import { AccountBasic } from "@/models/account";
import { TransactionDatePicker } from "@/components/form/transactions/TransactionDatePicker";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { useFinancialGoalTransactionForm } from "@/components/form/goal-transactions/hooks/useFinancialGoalTransactionForm";
import { FinancialGoalTransactionType } from "@/models/financialGoalTransactions";

type TransactionDialogProps = {
  id?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  mutate?: () => void;
  // financialGoalId?: string;
};

const FormTransactionDialog = ({
  id,
  setIsOpen,
  isOpen,
  mutate,
  // financialGoalId,
}: TransactionDialogProps) => {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  const {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    isLoadingTransaction,
    loadingAccouts,
    accounts,
    financialGoals,
    loadingGoals,
  } = useFinancialGoalTransactionForm(id);
  const { toast } = useToast();

  function reset() {
    setFormData({
      amount: undefined,
      account_id: undefined,
      financial_goal_id: undefined,
      type: "contribution",
      status: "completed",
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
      !formData.financial_goal_id ||
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
            <DialogTitle>{id ? t("EDIT_TRANSACTION") : t("NEW_TRANSACTION")}</DialogTitle>
            <DialogDescription>
              {id ? t("EDIT_TRANSACTION_FORM_DIALOG_TEXT") : t("NEW_TRANSACTION_FORM_DIALOG_TEXT")}
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
            {!id && (
              <div className="grid gap-1.5">
                <Label htmlFor="tx-goal">{t("FINANCIAL_GOAL")}</Label>
                {!loadingGoals ? (
                  <Select
                    value={formData.financial_goal_id}
                    onValueChange={(id: string) =>
                      setFormData((p) => ({ ...p, financial_goal_id: id }))
                    }
                  >
                    <SelectTrigger id="tx-goal">
                      <SelectValue placeholder={t("SELECT_FINANCIAL_GOAL")} />
                    </SelectTrigger>
                    <SelectContent>
                      {financialGoals?.map((fg) => (
                        <SelectItem key={fg.id} value={fg.id}>
                          {fg.name}
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
              {!id && (
                <div className="grid gap-1.5">
                  <Label htmlFor="tx-type">{t("TYPE")}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e as FinancialGoalTransactionType,
                      }))
                    }
                    required
                  >
                    <SelectTrigger id="tx-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contribution">{t("CONTRIBUTION")}</SelectItem>
                      <SelectItem value="withdrawal">{t("WITHDRAWAL")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
              <TransactionDatePicker
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
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t("CANCEL")}
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.account_id ||
                !formData.amount ||
                !formData.date ||
                !formData.financial_goal_id ||
                !formData.type ||
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

export default FormTransactionDialog;
