import Swal from "sweetalert2";

export function SwalToast({
  message,
  icon,
}: {
  message: string;
  icon: "success" | "warning" | "info" | "error";
}) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
}
