import { TransactionType } from "@/lib/models/transaction";

export function TransactionTypeSelector({
  type,
  onChangeType,
}: {
  type: TransactionType;
  onChangeType: any;
}) {
  return (
    <div className="flex justify-center gap-2 col-span-12">
      <button
        type="button"
        onClick={() => onChangeType("revenue")}
        className={`
          px-4 py-2 rounded-md font-medium transition-colors
          ${
            type === "revenue"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }
        `}
      >
        Receita
      </button>

      <button
        type="button"
        onClick={() => onChangeType("expense")}
        className={`
          px-4 py-2 rounded-md font-medium transition-colors
          ${
            type === "expense"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }
        `}
      >
        Despesa
      </button>
    </div>
  );
}
