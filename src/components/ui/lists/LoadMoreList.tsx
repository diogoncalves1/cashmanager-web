import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  loadMore: () => void;
  total: number;
  subjectLength: number;
};

const LoadMoreList = ({ loadMore, total, subjectLength }: Props) => {
  const t = useTranslations("LISTS");

  const remaining = total - subjectLength;

  return (
    <div className="flex justify-center col-span-3">
      <Button variant="outline" size="lg" onClick={loadMore} className="gap-2 bg-transparent">
        <span className="text-muted-foreground">
          ({remaining} {remaining > 1 ? t("REMAINING_PLURAL") : t("REMAINING")})
        </span>
      </Button>
    </div>
  );
};

export default LoadMoreList;
