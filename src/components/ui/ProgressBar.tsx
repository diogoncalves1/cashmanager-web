import React from "react";

interface ProgressBarProps {
  value: number; // valor entre 0 e 1
  height?: string; // opcional, altura da barra
  color?: string; // cor da barra
  className?: string; // classes extras
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = "h-3",
  color = "bg-green-500",
  className = "",
}) => {
  const clampedValue = Math.max(0, Math.min(1, value)); // garante que fique entre 0 e 1

  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} ${className}`}>
      <div
        className={`rounded-full ${color} transition-all duration-300`}
        style={{ width: `${clampedValue * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar;
