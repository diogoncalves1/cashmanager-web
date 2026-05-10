"use client";

import { useEffect, useRef, useState } from "react";
import { Invitation, InvitationStatus, InvitationType } from "@/features/invitations/types";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { InvitationCard } from "@/features/invitations/components/cards/InvitationCard";
import { InvitationEmpty } from "@/features/invitations/components/empty/InvitationEmpty";
import { onAcceptInvite, onRevokeInvite } from "@/features/invitations/api/invitation.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingToast from "@/components/swal/LoadingToast";
import { useToast } from "@/shared/hooks/useToast";

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
  status: InvitationStatus | "all";
};

const ReceivedInvitesList = ({ setLoad, load, type }: Props) => {
  const t = useTranslations("INVITE_MEMBER");
  const { toast } = useToast();
  const [receivedFilter, setReceivedFilter] = useState<InvitationStatus | "all">("all");

  const fetchReceived = async ({ pageParam = 1, status }: FetchInvitedParams): Promise<Page> => {
    const response = await fetch(
      `/api/${type}/received-invitations?page=${pageParam}&size=10&status=${status}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar pedidos");
    }

    return response.json();
  };

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "5px",
  });

  const prevInViewRef = useRef(false);

  const { data, fetchNextPage, refetch, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery<Page, Error>({
      queryKey: [`received-invites-${type}`, receivedFilter],
      queryFn: ({ pageParam = 1 }) =>
        fetchReceived({ pageParam: pageParam, status: receivedFilter }),
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
  }, [load, refetch]);

  const handleAccept = async (id: string) => {
    const loadingT = await LoadingToast({ title: t("ACCEPTING"), message: t("ACCEPTING_TEXT") });
    const res = await onAcceptInvite(id, type, () => {
      setLoad(true);
      refetch();
    });
    loadingT.close();

    toast({ description: res.message });
  };

  const handleReject = async (id: string) => {
    const loadingT = await LoadingToast({ title: t("REJECTING"), message: t("REJECTING_TEXT") });
    const res = await onRevokeInvite(id, type, () => {
      setLoad(true);
      refetch();
    });
    loadingT.close();
    toast({ description: res.message });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center space-x-2">
        <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

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

  const receivedInvitations = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={receivedFilter}
          onValueChange={(v) => setReceivedFilter(v as InvitationStatus | "all")}
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
      {receivedInvitations.length === 0 ? (
        <InvitationEmpty direction="received" />
      ) : (
        receivedInvitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            direction="received"
            type={type}
            onAccept={handleAccept}
            onReject={handleReject}
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

export default ReceivedInvitesList;
