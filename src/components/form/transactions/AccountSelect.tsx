import Select from "react-select";
import { Account } from "@/lib/models/account";

export function AccountSelect({
  accountData,
  value,
  onChange,
}: {
  accountData: any;
  value: string | undefined;
  onChange: any;
}) {
  return (
    <Select
      isSearchable={true}
      key={value}
      options={accountData.data.map((c: Account) => {
        return {
          value: c.id,
          label: c.name,
        };
      })}
      onChange={(e: any) => {
        onChange(e.value);
      }}
      defaultValue={accountData.data
        .map((c: Account) => ({ value: c.id, label: c.name }))
        .find((option: any) => option.value === value)}
      placeholder="Selecione uma conta..."
      className="basic-select"
      classNamePrefix="select"
      required={true}
    ></Select>
  );
}
