import { getInvitationStats } from "@/features/invitations/server";
import { useState, useEffect, useCallback } from "react";

type Summary = {
  sentInvites: number;
  receivedInvites: number;
  pendingInvites: number;
  awaitingInvites: number;
};

export function useInvitationStats(type: "accounts" | "debts" | "financial-goals") {
  const [stats, setStats] = useState<Summary>({
    sentInvites: 0,
    receivedInvites: 0,
    pendingInvites: 0,
    awaitingInvites: 0,
  });
  const [load, setLoad] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getInvitationStats(type);

      setStats(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (load) fetchStats();
    setLoad(false);
  }, [load, fetchStats]);

  return {
    stats,
    loading,
    setLoad,
    load,
  };
}
