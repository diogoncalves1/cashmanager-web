import { useState, useEffect } from "react";
import { getInvitationStats } from "@/services/financial-goal-transactions/financialGoalTransaction.service";

type Summary = {
  sentInvites: number;
  receivedInvites: number;
  pendingInvites: number;
  awaitingInvites: number;
};

export function useInvitationStats() {
  const [stats, setStats] = useState<Summary>({
    sentInvites: 0,
    receivedInvites: 0,
    pendingInvites: 0,
    awaitingInvites: 0,
  });
  const [load, setLoad] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await getInvitationStats();

      setStats(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (load) fetchStats();
    setLoad(false);
  }, [load]);

  return {
    stats,
    loading,
    setLoad,
    load,
  };
}
