import { cn, getUserColor, getUserInitials } from "@/shared/utils";

export function NotificationAvatar({
  title,
  size = "md",
}: {
  title: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = { sm: "size-8 text-[10px]", md: "size-10 text-xs", lg: "size-14 text-base" }[
    size
  ];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium",
        getUserColor(title),
        sizeClass
      )}
    >
      {getUserInitials(title)}
    </div>
  );
}
