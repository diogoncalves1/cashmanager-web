import { MyPagination } from "@/components/transactions/TableContainer";
import { DebtPayment } from "@/types/debtPayment";
import { Table } from "@tanstack/react-table";

export async function onDeleteDebtPayment(
  id: string,
  table?: Table<DebtPayment>,
  pagination?: MyPagination,
  mutate?: () => void
) {
  const res = await fetch(`/api/debt-payments/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();

  if (data.success) {
    if (table) {
      if (table.getRowCount() == 0 && pagination) pagination.pageIndex--;
    }
  }
  return data;
}

export async function onConfirmDebtPayment(id: string, mutate?: () => void) {
  try {
    const res = await fetch(`/api/debt-payments/${id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: false };
    } else {
      return { message: String(err), success: false };
    }
  }
}
