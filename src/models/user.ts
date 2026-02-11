import { Currency } from "./currency";
import { SharedRole } from "./sharedRole";

export interface UserPreferences {
  lang: "pt" | "en";
  currency: Currency;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  preferences?: UserPreferences;
  sharedRole?: SharedRole;
}
