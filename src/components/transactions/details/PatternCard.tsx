export function PatternCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
      <p className="font-semibold text-indigo-700">{title}</p>
      <p className="text-indigo-600 text-sm">{detail}</p>
    </div>
  );
}
