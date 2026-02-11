"use client";

import { Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/models/language";
import { Currency } from "@/models/currency";

interface PreferencesCardProps {
  language?: string;
  currency?: string;
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
  languages: Language[];
  currencies: Currency[];
  loadingCurrencies: boolean;
  loadingLanguages: boolean;
}

export function PreferencesCard({
  language,
  currency,
  isLoading,
  onChange,
  languages,
  currencies,
  loadingLanguages,
  loadingCurrencies,
}: PreferencesCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            {isLoading || loadingLanguages ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select value={language} onValueChange={(val) => onChange("lang", val)}>
                <SelectTrigger id="lang" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            {isLoading || loadingCurrencies ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select value={currency} onValueChange={(val) => onChange("currency_id", val)}>
                <SelectTrigger id="currency_id" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((cur) => (
                    <SelectItem key={cur.id} value={cur.id}>
                      {cur.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
