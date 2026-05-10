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

export interface ApiResponse<T> {
  data: T;
  recordsFiltered: number;
  page: number;
  pageSize: number;
}

export interface Stats {
  friends: number;
  received: number;
  sent: number;
  blocked: number;
}
