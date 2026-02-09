import { Friendship } from "@/models/friendship";
import { SharedRole } from "@/models/sharedRole";
import { useEffect, useState } from "react";

type InviteType = "debts" | "financial-goals" | "accounts";

type FormData = {
  shared_role_id?: string;
  subject_id?: string;
  user_id?: string;
  type: InviteType;
  id?: string;
};

type SubmitResult = {
  success: boolean;
  message: string;
};

type Props = {
  type: InviteType;
  id?: string;
  load: boolean;
};

export function useDataForInvite({ type, id, load = true }: Props) {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [roles, setRoles] = useState<SharedRole[]>([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    type: type,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const requests = [fetch("/api/friends"), fetch("/api/shared-roles")];

        if (!id) {
          requests.push(fetch(`/api/${type}/all`));
        }

        const [friendsRes, rolesRes, subjectsRes] = await Promise.all(requests);

        const friendsData = await friendsRes.json();
        const rolesData = await rolesRes.json();

        setFriends(friendsData.data);
        setRoles(rolesData.data);
        if (!id) {
          const subjectsData = await subjectsRes.json();
          setSubjects(subjectsData.data);
        }
      } catch (err: any) {
        setError(err.message ?? "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }
    if (load) loadData();
  }, [load]);

  const handleSubmit = async (): Promise<SubmitResult> => {
    try {
      const url = `/api/invite-member`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      return { success: true, message: result.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Erro ao guardar transação" };
    }
  };

  return {
    friends,
    roles,
    loading,
    handleSubmit,
    error,
    formData,
    setFormData,
    subjects,
  };
}
