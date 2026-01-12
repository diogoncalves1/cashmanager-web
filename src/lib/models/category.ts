import { icons, TrendingDown, TrendingUp, Car, Utensils, Wallet, ShoppingCart } from "lucide-react";

export interface Category {
  id: number;
  name: string;
  type: string;
  typeTranslated: string;
  icon: keyof typeof icons;
  color: string;
}

export const iconMap = {
  Car,
  Utensils,
  Wallet,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} as const;

export type IconName = keyof typeof iconMap;
