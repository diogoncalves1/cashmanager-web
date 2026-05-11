type StatCardProps = {
  icon: React.ReactNode;
  color: "blue" | "amber" | "emerald" | "rose";
  label: string;
  value: string;
  isHighlight?: boolean;
};

export function StatCard({ icon, color, label, value, isHighlight = false }: StatCardProps) {
  const colors = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", iconBg: "bg-rose-100" },
  }[color];

  return (
    <div
      className={`
        rounded-xl p-4 transition-all duration-300
        ${colors.bg}
        hover:shadow-md hover:scale-[1.02]
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
          <div className={`${colors.text}`}>{icon}</div>
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${isHighlight ? "text-emerald-700" : "text-gray-900"}`}>
        {value}
      </div>
    </div>
  );
}
