import { User } from "@/types/user";

export type FriendRequest = {
  id: string;
  from: User;
  to: User;
  status: "pending" | "accepted" | "rejected";
};

export interface Friendship {
  id: string;
  user: User;
  status: string;
  createdAt: string;
  updatedAt: string;
}
