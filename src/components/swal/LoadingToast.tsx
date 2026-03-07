import Swal from "sweetalert2";

type Props = { title: string; message: string };

export default function LoadingToast({ title, message }: Props) {
  Swal.fire({
    title: title,
    html: `
      <div class="flex flex-col items-center py-6">
        <div class="relative w-15 h-15">
          <div class="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"></div>
          <div class="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-500 animate-spin-slow"></div>
        </div>
        <p class="mt-6 text-gray-600 dark:text-gray-300">
          ${message}
        </p>
      </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return { close: () => Swal.close() };
}
