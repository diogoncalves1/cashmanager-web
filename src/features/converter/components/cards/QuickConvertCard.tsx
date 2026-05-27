import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { useTranslations } from "next-intl";

const QuickConvertCard = ({
  amount,
  setAmount,
  setError,
  result,
  convert,
  fromInfo,
}: {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  result: number | null;
  convert: (presetAmount?: number) => void;
  fromInfo?: { symbol: string } | null;
}) => {
  const t = useTranslations("CONVERTER");

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("QUICK_CONVERT")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[100, 500, 1000, 5000, 10000, 50000].map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-lg border-border/50 text-xs transition-all",
                amount === String(preset)
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "hover:bg-secondary/50"
              )}
              onClick={() => {
                setAmount(String(preset));
                setError(null);
                if (result) {
                  convert(preset);
                }
              }}
            >
              {fromInfo?.symbol}
              {preset.toLocaleString()}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickConvertCard;
