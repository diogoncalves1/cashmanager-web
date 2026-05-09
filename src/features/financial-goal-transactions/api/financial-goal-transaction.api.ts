import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import {
  FinancialGoalTransaction,
  MyPagination,
} from "@/features/financial-goal-transactions/types";
import { Table } from "@tanstack/react-table";

export async function onDeleteFinancialGoalTransaction(
  id: string,
  table?: Table<FinancialGoalTransaction>,
  pagination?: MyPagination,
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
        if (table.getRowCount() == 0 && pagination) pagination.pageIndex--;
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

interface ApiResponse<T> {
  data: T;
  meta: number;
}

export async function getFinancialGoalTransactionById(
  id: string
): Promise<ApiResponse<FinancialGoalTransaction>> {
  const res = await fetch(`/api/financial-goal-transactions/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goal transaction");

  const response = await res.json();
  return response;
}
