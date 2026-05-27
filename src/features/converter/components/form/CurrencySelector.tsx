"use client";

import type { CurrencyInfo } from "@/features/converter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/shared/utils";

interface CurrencySelectorProps {
  currencies: CurrencyInfo[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
}

export function CurrencySelector({
  currencies: currencyList,
  value,
  onValueChange,
  label,
}: CurrencySelectorProps) {
  const selected = currencyList.find((c) => c.code === value);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "h-14 rounded-xl border-border/50 bg-secondary/30 text-base",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          )}
        >
          <SelectValue>
            {selected && (
              <span className="flex items-center gap-3">
                <span className="font-semibold">{selected.code}</span>
                <span className="hidden text-muted-foreground sm:inline">{selected.name}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {currencyList.map((currency) => (
            <SelectItem key={currency.code} value={currency.code} className="py-3">
              <span className="flex items-center gap-3">
                <span className="font-semibold">{currency.code}</span>
                <span className="text-muted-foreground">{currency.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
