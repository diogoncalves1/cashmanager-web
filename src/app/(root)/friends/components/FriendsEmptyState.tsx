import type { LucideIcon } from "lucide-react";

interface FriendsEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FriendsEmptyState({ icon: Icon, title, description }: FriendsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
