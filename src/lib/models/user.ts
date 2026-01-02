import { SharedRole } from "./sharedRole";

export interface UserPreferences {
  lang: "pt" | "en";
}

export interface User {
  id: string;
  name: string;
  email?: string;
  preferences?: UserPreferences;
  sharedRole?: SharedRole;
}
