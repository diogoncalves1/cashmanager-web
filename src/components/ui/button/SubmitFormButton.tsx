import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function SubmitFormButton({
  isSubmitting,
  isDisable,
}: {
  isSubmitting: boolean;
  isDisable?: boolean;
}) {
  const t = useTranslations("BUTTONS");
  return (
    <div className="pt-4">
      <Button
        type="submit"
        disabled={isDisable || isSubmitting}
        className={cn(
          "w-full h-14 text-base font-medium transition-all duration-200",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t("PROCESSING")}
          </span>
        ) : (
          t("SUBMIT")
        )}
      </Button>
    </div>
  );
}
