import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";

const CurrencySwapButton = ({ swapCurrencies }: { swapCurrencies: () => void }) => {
  return (
    <div className="flex items-end justify-center pb-1">
      <Button
        variant="outline"
        size="icon"
        className="size-12 shrink-0 rounded-full border-border/50 bg-secondary/50 transition-all hover:bg-primary/10 hover:border-primary/30 hover:scale-110 active:scale-95"
        onClick={swapCurrencies}
        aria-label="Swap currencies"
      >
        <ArrowDownUp className="size-4 rotate-90 sm:rotate-0" />
      </Button>
    </div>
  );
};

export default CurrencySwapButton;
