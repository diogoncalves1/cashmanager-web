export function RelatedTransaction({
  title,
  date,
  amount,
  highlight,
}: {
  title: string;
  date: string;
  amount: string;
  highlight: string;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold">{amount}</p>
        <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
          {highlight}
        </span>
      </div>
    </div>
  );
}
