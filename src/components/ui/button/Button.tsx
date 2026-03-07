import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  color?: "primary" | "success" | "danger" | "warning" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  startIcon,
  color = "primary",
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-1.5 text-sm",
  };

  const colorClasses = {
    secondary:
      "ring-gray-500 text-gray-500 shadow-theme-x hover:bg-gray-500 hover:text-white disabled:ring-gray-300",
    primary:
      "ring-brand-500 text-brand-500 shadow-theme-xs hover:bg-brand-500 hover:text-white disabled:ring-brand-300",
    success:
      "ring-green-500  text-green-500 shadow-theme-xs hover:bg-green-500 hover:text-white  disabled:ring-green-300",
    danger:
      "ring-red-500 text-red-500 shadow-theme-xs hover:bg-red-500 hover:text-white disabled:ring-red-300",
    warning:
      "ring-yellow-500 text-yellow-500 shadow-theme-xs hover:bg-yellow-500 hover:text-white disabled:ring-yellow-300",
  };

  // Variant Classes
  // const variantClasses = {
  //   primary: "text-white shadow-theme-xs ",
  //   outline:
  //     "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  // };

  return (
    <button
      className={`inline-flex items-center ring-1 justify-center font-light gap-4 rounded-sm transition ${className} ${
        colorClasses[color]
      } ${sizeClasses[size]}  ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
