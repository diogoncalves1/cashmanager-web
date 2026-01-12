import { Category } from "@/lib/models/category";
import Select from "react-select";
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

  const category = categoriesMap[value as string];
  const selectedOpt = { value: category?.id ?? null, label: category?.name ?? null };

  return (
    <Select
      isSearchable={true}
      key={value}
      options={categoryOptions}
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
