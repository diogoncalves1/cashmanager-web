import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SwalToast } from "@/components/swal/SwalToast";
import LoadingToast from "@/components/swal/LoadingToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FinancialGoalTransaction } from "@/models/financialGoalTransactions";

type Props = {
  isEditGoalOpen: boolean;
  setIsEditGoalOpen: any;
  handleSubmit: any;
  setFormData: any;
  formData: {
    amount?: string;
    date?: string;
    description?: string;
  };
  mutate?: any;
};

export default function EditGoalTransactionDialog({
  isEditGoalOpen,
  setIsEditGoalOpen,
  handleSubmit,
  mutate,
  setFormData,
  formData,
}: Props) {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    LoadingToast({
      title: t("SAVING"),
      message: "A atualizar transação...",
    });

    const res = await handleSubmit();
    if (mutate != null) mutate();

    if (res.success) {
      return SwalToast({ message: res.message, icon: "success" });
    }
    return SwalToast({ message: res.message, icon: "error" });
  };

  return (
    <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Make changes to your financial goal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  defaultValue={formData.amount}
                  className="pl-7"
                  onChange={(e) => {
                    setFormData((prev: any) => ({ ...prev, amount: e.target.value }));
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Date</Label>
              <Input
                type="date"
                defaultValue={formData.date}
                onChange={(e) => {
                  setFormData((prev: any) => ({ ...prev, date: e.target.value }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                placeholder="Add a note about this transaction..."
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev: any) => ({ ...prev, description: e.target.value }));
                }}
                className="min-h-24 bg-input border-border resize-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditGoalOpen(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" onClick={() => setIsEditGoalOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
