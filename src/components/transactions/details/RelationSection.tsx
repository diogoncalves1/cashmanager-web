export function RelationSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}
