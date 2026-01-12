import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import Swal from "sweetalert2";

export async function onDeleteFinancialGoal(
  id: string,
  table?: any,
  pagination?: any,
  mutate?: any
) {
  const result = await Swal.fire({
    title: "Tem certeza?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, deletar!",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    LoadingToast({ title: "Excluindo...", message: "Removendo meta financeira ..." });
    try {
      const res = await fetch(`/api/financial-goals/${id}`, {
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
    } catch (err: any) {
      SwalToast({ message: err.message, icon: "error" });
      return 0;
    }
  }
  return 0;
}

export async function onMarkPaidFinancialGoal(id: string, mutate?: any) {
  const result = await Swal.fire({
    title: "Completar meta financeira?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, completar!",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    LoadingToast({ title: "A completar...", message: "A completar a sua meta financeira..." });
    try {
      const res = await fetch(`/api/financial-goals/${id}/complete`, {
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
    } catch (err: any) {
      SwalToast({ message: err.message, icon: "error" });
      return 0;
    }
  }
  return 0;
}
