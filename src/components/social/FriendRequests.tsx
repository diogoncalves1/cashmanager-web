// components/FriendsList.tsx
"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { use, useEffect, useState } from "react";
import { Friendship } from "@/lib/models/friendship";
import { UserCircle } from "../ui/avatar/UserCircle";
import Button from "../ui/button/Button";
import { Check, Lock, UserMinus, X } from "lucide-react";
import { onBlockUser, onRemoveFriend } from "@/services/friends/service";
import { useTranslations } from "next-intl";
import { onAcceptRequest, onDeclineRequest } from "@/services/friend-requests/service";

type Page = { data: Friendship[]; nextPage: number | null };

const fetchFriends = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: any[];
}): Promise<Page> => {
  const searchTerm = queryKey[1] || ""; // segundo item da queryKey
  const response = await fetch(
    `/api/friend-requests/received?page=${pageParam}&size=10&search=${searchTerm}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar amigos");
  }

  return response.json();
};

export default function FriendRequests() {
  const t = useTranslations("FRIENDS");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px", // carrega antes de chegar ao fundo
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery<Page, Error>({
      queryKey: ["receivedRequests", debouncedSearch],
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

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {t("LOADING_REQUESTS")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        Error: {error.message}
        <button onClick={() => window.location.reload()} className="ml-3 underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  const allFriends = data?.pages.flatMap((page: any) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("SEARCH_BY_USER")}
          className="w-full p-2 border rounded"
        />
      </div>

      {allFriends.length === 0 ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
          {t("HAVE_NO_REQUESTS")}
        </p>
      ) : (
        allFriends.map((friend) => (
          <div
            key={friend.id}
            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-4">
              <UserCircle userName={friend.user.name} size={10} />
              <div>
                <p className="font-medium">{friend?.user?.name}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {friend.actions.accept && (
                <Button
                  onClick={async () => {
                    if (await onAcceptRequest(friend.user.id, t)) {
                      queryClient.invalidateQueries(["friends", debouncedSearch]);
                      queryClient.invalidateQueries(["receivedRequests", debouncedSearch]);
                    }
                  }}
                  color="success"
                  startIcon={<Check size={16} />}
                >
                  {t("ACCEPT")}
                </Button>
              )}
              <Button
                onClick={async () => {
                  if (await onDeclineRequest(friend.user.id, t)) {
                    queryClient.invalidateQueries(["receivedRequests", debouncedSearch]);
                  }
                }}
                color="danger"
                startIcon={<X size={16} />}
              >
                {t("DECLINE")}
              </Button>
            </div>
          </div>
        ))
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
