"use client";

import React, { useEffect, useRef, useState } from "react";
import { Invitation, InvitationStatus, InvitationType } from "@/features/invitations/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InvitationCard } from "@/features/invitations/components/cards/InvitationCard";
import { onCancelInvite } from "@/features/invitations/api/invitation.api";
import { InvitationEmpty } from "@/features/invitations/components/empty/InvitationEmpty";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/shared/hooks/useToast";
import LoadingToast from "@/components/swal/LoadingToast";

interface Page {
  data: Invitation[];
  nextPage: number | null;
}

type Props = {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  load: boolean;
  type: InvitationType;
};

type FetchInvitedParams = {
  pageParam?: number | unknown;
  status?: string;
};

const InvitesList = ({ setLoad, load, type }: Props) => {
  const t = useTranslations("INVITE_MEMBER");
  const { toast } = useToast();
  const [sentFilter, setSentFilter] = useState<InvitationStatus | "all">("all");

  const fetchInvited = async ({ pageParam = 1, status }: FetchInvitedParams): Promise<Page> => {
    const response = await fetch(
      `/api/${type}/sent-invitations?page=${pageParam}&size=10&status=${status}`,
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

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery<Page, Error>({
      queryKey: [`sent-invites-${type}`, sentFilter],
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
  }, [inView, hasNextPage, fetchNextPage, refetch]);

  useEffect(() => {
    if (load) refetch();
  }, [load, refetch]);

  const handleCancel = async (id: string, userId: string) => {
    const loadingT = await LoadingToast({
      title: t("CANCELING_TITLE"),
      message: t("CANCELING_MESSAGE"),
    });
    const res = await onCancelInvite(id, userId, type, () => {
      refetch();
      setLoad(true);
    });
    loadingT.close();
    toast({ description: res.message });
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
        {t("ERROR")}:
        <button onClick={() => window.location.reload()} className="ml-3 underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  const sentInvitations = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <Select
          value={sentFilter}
          onValueChange={(v) => setSentFilter(v as InvitationStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("FILTER_STATUS")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("ALL_STATUS")}</SelectItem>
            <SelectItem value="pending">{t("PENDING")}</SelectItem>
            <SelectItem value="accepted">{t("ACCEPTED")}</SelectItem>
            <SelectItem value="revoked">{t("REVOKED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sentInvitations.length === 0 ? (
        <InvitationEmpty direction="sent" />
      ) : (
        sentInvitations.map((invitation) => (
          <InvitationCard
            type={type}
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
