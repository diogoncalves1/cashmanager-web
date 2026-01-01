import { Category } from "@/lib/models/category";
import Select from "react-select";
import * as LucideIcons from "lucide-react";
import { useMemo } from "react";

export function CategorySelect({
  categoriesData,
  value,
  onChange,
}: {
  categoriesData: any;
  value: string | undefined;
  onChange: any;
}) {
  const categoryOptions =
    categoriesData?.data?.map((c: Category) => {
      return { value: `${c.id}`, label: c.name };
    }) ?? [];

  const categoriesMap = useMemo(() => {
    return Object.fromEntries(categoriesData.data.map((c: any) => [c.id, c]));
  }, [categoriesData]);

  const formatOptionLabel = (option: any) => {
    const category = categoriesMap[option.value];
    if (!category) return option.label;

    const Icon = LucideIcons[category?.icon as keyof typeof LucideIcons] as any;

    return (
      <div className="flex items-center gap-3 py-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
          <Icon className="h-4 w-4" style={{ color: category.color }} />
        </div>
        <span className="text-md text-muted-foreground">{category.name}</span>
      </div>
    );
  };

  const category = categoriesMap[value as string];
  const selectedOpt = { value: category?.id ?? null, label: category?.name ?? null };

  return (
    <Select
      isSearchable={true}
      key={value}
      options={categoryOptions}
      formatOptionLabel={formatOptionLabel}
      value={selectedOpt}
      onChange={(selected) => {
        onChange(selected.value ?? "");
      }}
      defaultValue={categoriesData.data
        .map((c: Category) => ({ value: c.id, label: c.name }))
        .find((option: any) => option === value)}
      placeholder="Selecione uma categoria..."
      className="basic-select"
      classNamePrefix="select"
      required={true}
    />
  );
}
