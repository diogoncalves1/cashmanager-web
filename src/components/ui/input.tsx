import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`h-9.5 w-full rounded border appearance-none px-4 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden  dark:placeholder:text-white/30  bg-transparent text-gray-700 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${className}`}
      {...props}
    />
  );
}

export { Input };
