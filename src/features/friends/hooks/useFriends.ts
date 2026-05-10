"use client";

import { useEffect, useState } from "react";
import { useFriendsContext, getFriendsStats } from "@/features/friends";

interface Stats {
  friends: number;
  received: number;
  sent: number;
  blocked: number;
}

export function useFriendStats() {
  const { loadCounter } = useFriendsContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    friends: 0,
    received: 0,
    sent: 0,
    blocked: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getFriendsStats();

      setStats(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch friends stats");
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [loadCounter]);

  return {
    loading,
    error,
    stats,
  };
}
