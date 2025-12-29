import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md" | "lg";
export type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";
type BadgeType = "rounded-sm" | "rounded" | "rounded-0";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  type?: BadgeType;
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  type = "rounded-sm",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles = `inline-flex items-center py-0 justify-center ${type} font-medium`;

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs px-1", // Smaller padding and font size
    md: "text-sm px-2.5", // Default padding and font size
    lg: "text-lg px-2.5",
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-brand-50 text-brand-500 border-brand-300 dark:bg-brand-500/15 dark:text-brand-400",
      success:
        "bg-success-50 text-success-600 border-success-500 dark:bg-success-500/15 dark:text-success-500",
      error: "bg-error-50 text-error-600 border-error-300 dark:bg-error-500/15 dark:text-error-500",
      warning:
        "bg-warning-50 text-warning-600 border-error-300 dark:bg-warning-500/15 dark:text-orange-400",
      info: "bg-blue-light-50 text-blue-light-500 border-blue-light-300 dark:bg-blue-light-500/15 dark:text-blue-light-500",
      light: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-white/5 dark:text-white/80",
      dark: "bg-gray-500 text-white border-white-300 dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-brand-500 text-white dark:text-white",
      success: "bg-success-500 text-white dark:text-white",
      error: "bg-error-500 text-white dark:text-white",
      warning: "bg-warning-500 text-white dark:text-white",
      info: "bg-blue-light-500 text-white dark:text-white",
      light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
      dark: "bg-gray-700 text-white dark:text-white",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`border-1 ${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
