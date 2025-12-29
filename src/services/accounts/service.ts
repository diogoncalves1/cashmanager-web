import { SwalToast } from "@/components/swal/SwalToast";
import Swal from "sweetalert2";

export async function onDeleteAccount(id: string, table?: any, pagination?: any, mutate?: any) {
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
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      await mutate();

      if (data.success) {
        if (table.getRowCount() == 0) pagination.pageIndex--;
        SwalToast({ message: data.message, icon: "success" });
      }
    } catch (err: any) {
      SwalToast({ message: err.message, icon: "error" });
    }
  }
}
