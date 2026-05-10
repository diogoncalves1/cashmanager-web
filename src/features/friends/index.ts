// Types
export type { FriendRequest, Friendship, ApiResponse, Stats } from "@/features/friends/types";

// States
export { FriendsProvider, useFriendsContext } from "@/features/friends/state/friends.context";

// API
export {
  getFriendsStats,
  onSendRequest,
  onBlockUser,
  onUnblockUser,
  onRemoveFriend,
} from "@/features/friends/api/friend.api";
export {
  onAcceptRequest,
  onCancelRequest,
  onDeclineRequest,
} from "@/features/friends/api/friend-request.api";

// Components
// cards
export { FriendCard } from "./components/cards/FriendCard";
export { PendingRequestCard } from "./components/cards/PendingRequestCard";
export { BlockedUserCard } from "./components/cards/BlockUserCard";

// lists
export { FriendsList } from "./components/lists/FriendsList";
export { ReceivedRequests } from "./components/lists/ReceivedRequests";
export { SentRequests } from "./components/lists/SentRequests";
export { BlockedUsers } from "./components/lists/BlockedUsers";

// forms
export { AddFriend } from "./components/forms/AddFriend";

// states
export { FriendsEmptyState } from "./components/states/FriendsEmptyState";

// navigation
export { SocialTabs } from "./components/navigation/SocialTabs";

// Hooks
export { useFriendStats } from "@/features/friends/hooks/useFriends";
