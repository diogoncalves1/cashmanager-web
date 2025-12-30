import { SharedRole } from "./sharedRole";

export interface User {
  id: string;
  name: string;
  sharedRole?: SharedRole;
}
