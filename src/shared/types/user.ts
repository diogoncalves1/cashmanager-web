import { Currency } from "@/shared/types/currency";
import { SharedRole } from "@/shared/types/sharedRole";

export interface UserPreferences {
  lang: "pt" | "en";
  currency: Currency;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  preferences?: UserPreferences;
  sharedRole?: SharedRole;
}

export interface UserSearch {
  id: string;
  username: string;
  name: string;
  status: "pending" | "blocked" | "friend" | "blocked";
}
