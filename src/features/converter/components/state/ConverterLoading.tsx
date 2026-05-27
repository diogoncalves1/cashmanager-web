import { RefreshCw } from "lucide-react";
import React from "react";

const ConverterLoading = () => {
  return (
    <div className="flex h-14 items-center justify-center rounded-xl border-border/50 bg-secondary/30">
      <RefreshCw className="size-4 animate-spin text-muted-foreground" />
    </div>
  );
};

export default ConverterLoading;
