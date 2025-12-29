import { SharedRole } from "./sharedRole";

export interface User {
  id: number;
  name: string;
  sharedRole?: SharedRole;
}
