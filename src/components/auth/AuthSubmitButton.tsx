import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
};

export default function AuthSubmitButton(props: Props) {
  return (
    <button
      disabled={props.disabled}
      className="flex items-center disabled:bg-brand-500/50 justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
    >
      {props.children}
    </button>
  );
}
