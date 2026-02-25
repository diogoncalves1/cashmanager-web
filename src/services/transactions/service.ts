import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import Swal from "sweetalert2";

export async function onDeleteTransaction(id: string, table?: any, pagination?: any) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  if (data.success) {
    if (table) {
      if (table.getRowCount() == 0) pagination.pageIndex--;
    }
  }
  return data;
}

export async function onConfirmTransaction(id: string, mutate?: () => void) {
  const result = await Swal.fire({
    title: "Confirm transaction?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, confirmar!",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    LoadingToast({ title: "A confirmar...", message: "A confirmar a sua transação..." });
    try {
      const res = await fetch(`/api/transactions/${id}/confirm`, {
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
  return 0;
}
