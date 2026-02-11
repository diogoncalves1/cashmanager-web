type Props = {
  children: any;
};

export default function AuthSubmitButton(props: Props) {
  return (
    <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
      {props.children}
    </button>
  );
}
