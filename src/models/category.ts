import {
  icons,
  TrendingDown,
  TrendingUp,
  Car,
  Utensils,
  Wallet,
  ShoppingCart,
  Banknote,
  Briefcase,
  ShoppingBasket,
  ChefHat,
  Bike,
  CarTaxiFront,
  Gamepad2,
  Wifi,
  Dumbbell,
  HeartPulse,
  GraduationCap,
  Plane,
  CircleDollarSign,
  Receipt,
  Gift,
  Landmark,
  CreditCard,
  Fuel,
  Bus,
  Tv,
  Gamepad,
  Home,
  Building,
  Lightbulb,
} from "lucide-react";

export interface Category {
  id: string;
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
  Banknote,
  Briefcase,
  ShoppingBasket,
  ChefHat,
  Bike,
  CarTaxiFront,
  Gamepad2,
  Gamepad,
  Home,
  Building,
  Lightbulb,
  Wifi,
  Dumbbell,
  HeartPulse,
  GraduationCap,
  Plane,
  CircleDollarSign,
  Receipt,
  Gift,
  Landmark,
  CreditCard,
  Fuel,
  Bus,
  Tv,
} as const;

export type IconName = keyof typeof iconMap;
