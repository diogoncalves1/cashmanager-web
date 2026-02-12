"use client";

import { Input } from "@/components/ui/input";
import Label from "../Label";
import { SwalToast } from "@/components/swal/SwalToast";
import { Currency } from "@/models/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingToast from "@/components/swal/LoadingToast";
import { useTranslations } from "next-intl";
import SubmitFormButton from "@/components/ui/button/SubmitFormButton";
import { useAccountForm } from "./hooks/useAccountForm";
import { accountTypes } from "@/models/account";
import Checkbox from "../input/Checkbox";

type Props = {
  id?: string;
};

export default function AccountsForm({ id }: Props) {
  const { formData, setFormData, isSubmitting, handleSubmit, loadingCurrencies, currencies } =
    useAccountForm(id);

  const t = useTranslations("FINANCIAL_GOALS");

  const onSubmit = async (e: React.FormEvent) => {
    LoadingToast({
      title: id ? "A atualizar..." : "A criar...",
      message: id ? "A atualizar transação..." : "A criar a sua transação...",
    });
    e.preventDefault();
    const result = await handleSubmit();
    SwalToast({
      message: result.message,
      icon: result.success ? "success" : "error",
    });
  };

  const currencySelected = currencies.find((c) => c.id == formData.currency_id);

  accountTypes;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Details
          </Label>
          <span className="text-xs text-muted-foreground">Step 1 of 3</span>
        </div>
        {/* sm:grid-cols-2 */}
        <div className="grid grid-cols-1  gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-muted-foreground">
              Name
            </Label>
            <Input
              id="date"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
              }}
              className="h-14 bg-input border-border text-foreground"
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-muted-foreground">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                {currencySelected?.symbol || "$"}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.total_amount ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, total_amount: e.target.value }));
                }}
                className="h-14 pl-12 text-lg bg-input border-border placeholder:text-muted-foreground/50"
                min="0"
                step="0.01"
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Type */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Select Type
          </Label>
          <span className="text-xs text-muted-foreground">Step 2 of 3</span>
        </div>
        <Select
          value={formData.type}
          onValueChange={(e: string) => {
            setFormData((prev) => ({ ...prev, type: e }));
          }}
        >
          <SelectTrigger className="h-14 bg-input border-border text-foreground">
            <SelectValue placeholder="Choose a type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {accountTypes?.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="py-3 cursor-pointer focus:bg-accent"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Currency */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Select Currency
          </Label>
          <span className="text-xs text-muted-foreground">Step 3 of 3</span>
        </div>
        {!loadingCurrencies ? (
          <Select
            value={formData.currency_id}
            onValueChange={(e: string) => {
              setFormData((prev) => ({ ...prev, currency_id: e }));
            }}
          >
            <SelectTrigger className="h-14 bg-input border-border text-foreground">
              <SelectValue placeholder="Choose a currency" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {!loadingCurrencies &&
                currencies?.map((currency: Currency) => (
                  <SelectItem
                    key={currency.id}
                    value={currency.id}
                    className="py-3 cursor-pointer focus:bg-secondary"
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{currency.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {currency.code} {currency.symbol}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-2 space-y-2">
            <div className="h-8 rounded bg-muted animate-pulse" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Checkbox
          label="Ativa"
          checked={formData.active}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, active: e }));
          }}
        />
      </div>

      {/* Submit */}
      <SubmitFormButton
        isSubmitting={isSubmitting}
        isDisable={!formData.currency_id || !formData.name || !formData.type}
      />

      {/* Form Helper */}
      <p className="text-center text-xs text-muted-foreground">
        All goals are securely processed and recorded instantly.
      </p>
    </form>
  );
}
