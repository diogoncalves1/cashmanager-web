import React, { useEffect, useRef } from "react";
import { InvitationStatus } from "@/models/invitation";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvitationCard } from "@/components/invitations/InvitationCard";
import { onCancelInvite } from "@/services/invitations/invitations.service";
import { InvitationEmpty } from "@/components/invitations/InvitationEmpty";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

interface Page {
  data: [];
  nextPage: number | null;
}

type Props = {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  load: boolean;
};

const InvitesList = ({ setLoad, load }: Props) => {
  const t = useTranslations("INVITATION");
  const [sentFilter, setSentFilter] = useState<InvitationStatus | "all">("all");

  const fetchInvited = async ({ pageParam = 1, status }: any): Promise<Page> => {
    const response = await fetch(
      `/api/financial-goals/sent-invitations?page=${pageParam}&size=10&status=${status}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar convites");
    }

    return response.json();
  };

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "5px",
  });

  const prevInViewRef = useRef(false);

  const {
    data,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<Page, Error>({
    queryKey: ["sent-invites", sentFilter],
    queryFn: ({ pageParam = 1 }) => fetchInvited({ pageParam: pageParam, status: sentFilter }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (inView && !prevInViewRef.current && hasNextPage) {
      fetchNextPage();
    }

    prevInViewRef.current = inView;
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (load) refetch();
  }, [load]);

  const handleCancel = async (id: string, userId: string) => {
    await onCancelInvite(id, userId, "financial-goals", () => {
      refetch();
      setLoad(true);
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center space-x-2">
        <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></span>
      </div>
    );

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

  const sentInvitations = data?.pages.flatMap((page: any) => page.data) ?? [];

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <Select
          value={sentFilter}
          onValueChange={(v) => setSentFilter(v as InvitationStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="revoked">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sentInvitations.length === 0 ? (
        <InvitationEmpty direction="sent" />
      ) : (
        sentInvitations.map((invitation) => (
          <InvitationCard
            type="financial-goals"
            key={invitation.id}
            invitation={invitation}
            direction="sent"
            onCancel={handleCancel}
          />
        ))
      )}

      {(isFetchingNextPage || hasNextPage) && (
        <div ref={ref} className="py-8 text-center">
          {isFetchingNextPage ? (
            <div className="flex justify-center space-x-2">
              <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </div>
          ) : hasNextPage ? (
            <p className="text-sm text-gray-500">{t("SCROLL_TO_SEE_MORE")}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default InvitesList;
