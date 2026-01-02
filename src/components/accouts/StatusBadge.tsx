export function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Ativo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
      Inativo
    </span>
  );
}
