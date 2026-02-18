"use client";

import { useEffect, useState } from "react";
import { getFriendsStats } from "../services/friends.service";
import { useFriendsContext } from "../context/FriendsContext";

export function useFriendStats() {
  const { loadCounter } = useFriendsContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getFriendsStats();

      setStats(res.data || {});
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
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
