import { User } from "@/types/user";

export interface Activity {
  title: string;
  message: string;
  user: User;
  createdAt: string;
}
