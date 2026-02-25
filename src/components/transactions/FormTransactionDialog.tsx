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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionStatus, TransactionType } from "@/models/transaction";
import { useToast } from "@/hooks/useToast";
import { useTransactionForm } from "../form/transactions/hooks/useTransactionForm";
import { Account } from "@/models/account";
import { Category, iconMap } from "@/models/category";
import { TransactionDatePicker } from "../form/transactions/TransactionDatePicker";
import { Textarea } from "../ui/textarea";

type NewTransactionDialogProps = {
  id?: string;
  setIsOpen: any;
  isOpen: boolean;
  mutate?: () => void;
};

const FormTransactionDialog = ({ id, setIsOpen, isOpen, mutate }: NewTransactionDialogProps) => {
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
  } = useTransactionForm(id);
  const { toast } = useToast();

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogDescription>Record a new income, expense, or transfer.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-4">
            {!id && (
              <div className="grid gap-1.5">
                <Label htmlFor="tx-account">Account</Label>
                {!isLoadingAccounts ? (
                  <Select
                    value={formData.account_id}
                    onValueChange={(id: string) => setFormData((p) => ({ ...p, account_id: id }))}
                  >
                    <SelectTrigger id="tx-account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.data.map((a: Account) => (
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="tx-amount">Amount</Label>
                <Input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
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
                  <Label htmlFor="tx-type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e as TransactionType,
                        category_id: undefined,
                      }))
                    }
                    required
                  >
                    <SelectTrigger id="tx-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="tx-category">Category</Label>
                {!isLoadingCategories ? (
                  <Select
                    value={formData.category_id}
                    onValueChange={(id: string) => setFormData((p) => ({ ...p, category_id: id }))}
                  >
                    <SelectTrigger id="tx-category">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.data.map((c: Category) => {
                        const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Circle;
                        return (
                          <SelectItem key={c.id} value={c.id}>
                            <Icon
                              className="h-5 w-5"
                              style={{
                                color: c.color,
                              }}
                            />
                            {c.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="h-8 rounded bg-muted animate-pulse" />
                  </div>
                )}
              </div>
              {!id && (
                <div className="grid gap-1.5">
                  <Label htmlFor="tx-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(status: TransactionStatus) => {
                      setFormData((prev) => ({ ...prev, status }));
                      updateDateLimits(status);
                    }}
                  >
                    <SelectTrigger id="tx-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tx-date">Date</Label>
              <TransactionDatePicker
                dateLimits={dateLimits}
                date={formData.date}
                onChangeDate={(newDate: string) => setFormData((p) => ({ ...p, date: newDate }))}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tx-description">Description</Label>
              <Textarea
                id="tx-description"
                placeholder="What was this for?"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormTransactionDialog;
