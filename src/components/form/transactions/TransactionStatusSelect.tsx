import { TransactionStatus, transactionStatus } from "@/lib/models/transaction";
import Select from "react-select";

export function TransactionStatusSelect({
  value,
  onChange,
}: {
  value: TransactionStatus;
  onChange: any;
}) {
  return (
    <Select
      isSearchable={true}
      key={value}
      options={transactionStatus}
      placeholder="Estado..."
      onChange={(e: any) => {
        onChange(e.value);
      }}
      defaultValue={transactionStatus
        .map((t: any) => ({ value: t.value, label: t.label }))
        .find((option: any) => option.value === value)}
      required={true}
    ></Select>
  );
}
