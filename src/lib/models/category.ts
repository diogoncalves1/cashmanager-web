import { icons } from "lucide-react";

export interface Category {
  id: number;
  name: string;
  type: string;
  typeTranslated: string;
  icon: keyof typeof icons;
  color: string;
}
