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
export { BlockedUserCard } from "@/features/friends/components/cards/BlockUserCard";
export { FriendCard } from "@/features/friends/components/cards/FriendCard";
export { PendingRequestCard } from "@/features/friends/components/cards/PendingRequestCard";
export { AddFriend } from "@/features/friends/components/forms/AddFriend";
export { BlockedUsers } from "@/features/friends/components/lists/BlockedUsers";
export { FriendsList } from "@/features/friends/components/lists/FriendsList";
export { ReceivedRequests } from "@/features/friends/components/lists/ReceivedRequests";
export { SentRequests } from "@/features/friends/components/lists/SentRequests";
export { SocialTabs } from "@/features/friends/components/navigation/SocialTabs";
export { FriendsEmptyState } from "@/features/friends/components/states/FriendsEmptyState";

// Hooks
export { useFriendStats } from "@/features/friends/hooks/useFriends";
