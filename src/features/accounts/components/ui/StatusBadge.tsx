export function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-accent/80 ring-1 ring-accent/80">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Ativo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-destructive/80 ring-1 ring-destructive/80">
      <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
      Inativo
    </span>
  );
}
