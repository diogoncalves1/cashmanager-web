import { SwalToast } from "@/components/swal/SwalToast";
import { Table } from "@tanstack/react-table";
import { MyPagination, Transaction } from "@/features/transactions";

export async function onDeleteTransaction(
  id: string,
  table?: Table<Transaction>,
  pagination?: MyPagination
) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (data.success) {
    if (table) {
      if (table.getRowCount() == 0 && pagination) pagination.pageIndex--;
    }
  }
  return data;
}

export async function onConfirmTransaction(id: string, mutate?: () => void) {
  try {
    const res = await fetch(`/api/transactions/${id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      return data;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      SwalToast({ message: err.message, icon: "error" });
      return { message: err.message };
    } else {
      SwalToast({ message: String(err), icon: "error" });
      return { message: String(err) };
    }
  }
}
