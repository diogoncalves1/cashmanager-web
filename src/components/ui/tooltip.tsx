import { useState } from "react";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg z-50 whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
}
