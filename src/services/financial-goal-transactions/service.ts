import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";

export async function onDeleteFinancialGoalTransaction(
  id: string,
  table?: any,
  pagination?: any,
  mutate?: () => void
) {
  LoadingToast({ title: "Excluindo...", message: "Removendo transação..." });
  try {
    const res = await fetch(`/api/financial-goal-transactions/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      if (table) {
        if (table.getRowCount() == 0) pagination.pageIndex--;
      }
      SwalToast({ message: data.message, icon: "success" });
      return 1;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      SwalToast({ message: err.message, icon: "error" });
    } else {
      SwalToast({ message: String(err), icon: "error" });
    }
    return 0;
  }
  return 0;
}

export async function onConfirmFinancialGoalTransaction(id: string, mutate?: () => void) {
  LoadingToast({ title: "A confirmar...", message: "A confirmar a sua transação..." });
  try {
    const res = await fetch(`/api/financial-goal-transactions/${id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      SwalToast({ message: data.message, icon: "success" });
      return 1;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      SwalToast({ message: err.message, icon: "error" });
    } else {
      SwalToast({ message: String(err), icon: "error" });
    }
    return 0;
  }
}
