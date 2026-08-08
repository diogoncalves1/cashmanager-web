import { PlusIcon } from "lucide-react";
import React from "react";
import { cn } from "@/shared/utils";
import { Button } from "@/components/ui/button";

type Props = React.ComponentProps<typeof Button> & {
  onClick?: () => void;
};

const CreateButton = ({ onClick, className, children, ...props }: Props) => {
  return (
    <div className={cn("flex w-min", className)}>
      <Button
        type="button"
        onClick={onClick}
        size="lg"
        variant="app"
        leftIcon={
          <PlusIcon
            size={19}
            strokeWidth={2.5}
            className="text-black/80 rounded-full bg-gray-300"
          />
        }
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default CreateButton;
