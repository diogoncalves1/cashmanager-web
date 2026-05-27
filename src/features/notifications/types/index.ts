export type Notification = {
  id: string;
  title: string;
  message: string;
  pathname: string;
  readAt: string;
  createdAt: string;
};

export type TabFilter = "all" | "unread";
