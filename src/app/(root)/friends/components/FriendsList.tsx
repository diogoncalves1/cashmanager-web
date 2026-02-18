"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Friendship } from "@/models/friendship";
import { Search, Users } from "lucide-react";
import { onBlockUser, onRemoveFriend } from "@/services/friends/service";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { FriendsEmptyState } from "./FriendsEmptyState";
import { FriendCard } from "./FriendCard";
import LoadingList from "@/components/ui/loading/LoadingList";
import { useFriendsContext } from "../context/FriendsContext";

type Page = { data: Friendship[]; nextPage: number | null };

const fetchFriends = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: any[];
}): Promise<Page> => {
  const searchTerm = queryKey[1] || ""; // segundo item da queryKey
  const response = await fetch(`/api/friends?page=${pageParam}&size=10&search=${searchTerm}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar amigos");
  }

  return response.json();
};

export default function FriendsList() {
  const { loadCounter, setLoadCounter } = useFriendsContext();
  const t = useTranslations("FRIENDS");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "5px",
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<Page, Error>({
    queryKey: ["friends", debouncedSearch],
    queryFn: fetchFriends,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    refetch();
  }, [loadCounter]);

  if (isError) {
    return (
      <div className="text-center  py-12 text-red-600">
        Error: {error.message}
        <button onClick={() => window.location.reload()} className="ml-3 underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  const allFriends = data?.pages.flatMap((page: any) => page.data) ?? [];
  return (
    <div className="space-y-4 w-full">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("SEARCH_BY_USER")}
          className="w-full p-2 border rounded"
        />
      </div>
      {isLoading ? (
        <LoadingList />
      ) : allFriends.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {allFriends.map((f) => (
            <FriendCard
              key={f.id}
              friendship={f}
              onRemove={async () => {
                if (await onRemoveFriend(f.user.id, t)) {
                  refetch();
                  setLoadCounter((prev) => prev + 1);
                }
              }}
              onBlock={async () => {
                if (await onBlockUser(f.user.id, t)) {
                  refetch();
                  setLoadCounter((prev) => prev + 1);
                }
              }}
            />
          ))}
        </div>
      ) : allFriends.length > 0 && debouncedSearch.trim() ? (
        <FriendsEmptyState
          icon={Search}
          title="No results"
          description={`No friends match "${debouncedSearch}". Try a different search.`}
        />
      ) : (
        <FriendsEmptyState
          icon={Users}
          title="No friends yet"
          description="Use the search above to find people and send friend requests."
        />
      )}

      <div ref={ref} className="py-8 text-center text-sm text-gray-500">
        {isFetchingNextPage
          ? t("LOADING_MORE_REQUESTS")
          : hasNextPage
            ? t("SCROLL_TO_SEE_MORE")
            : ""}
      </div>
    </div>
  );
}
