import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { enUS, pt } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export function TransactionDatePicker({
  date,
  dateLimits,
  onChangeDate,
  className,
}: {
  date?: string;
  dateLimits: { min?: string; max?: string };
  onChangeDate: (value: string) => void;
  className?: string;
}) {
  const t = useTranslations("TRANSACTIONS");
  const { user } = useAuth();
  const lang = user.preferences?.lang || "en";

  const locales = { pt: pt, en: enUS };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-input bg-background",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(new Date(date), "PPP", { locale: locales[lang] })
          ) : (
            <span>{t("SELECT_DATE")}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="single"
          locale={locales[lang]}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={2100}
          selected={date ? new Date(date) : undefined}
          disabled={(day: Date) => {
            if (!dateLimits.min && !dateLimits.max) return false;

            const min = dateLimits.min ? new Date(dateLimits.min) : null;
            const max = dateLimits.max ? new Date(dateLimits.max) : null;

            if ((min && day < min) || (max && day > max)) return true;

            return false;
          }}
          onSelect={(date) => {
            onChangeDate(
              date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                : ""
            );
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
