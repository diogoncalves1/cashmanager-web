import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function FinancialGoalDatePicker({
  date,
  dateLimits,
  onChangeDate,
}: {
  date: string;
  dateLimits: any;
  onChangeDate: any;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-14 bg-input border-border text-foreground justify-start text-left font-normal ",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(new Date(date), "PPP") : <span>Selecione a data...</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          required={true}
          mode="single"
          selected={date ? new Date(date) : undefined}
          disabled={(day: Date) => {
            if (!dateLimits.min && !dateLimits.max) return false;

            const min = dateLimits.min ? new Date(dateLimits.min) : null;
            const max = dateLimits.max ? new Date(dateLimits.max) : null;

            let isDisable = false;

            if ((min && day < min) || (max && day > max)) isDisable = true;

            return isDisable;
          }}
          onSelect={(date) => {
            onChangeDate(date ? date.toISOString().split("T")[0] : "");
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
