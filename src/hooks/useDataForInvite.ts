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
    subject_id: id,
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message ?? "Erro inesperado");
        } else {
          setError("Erro inesperado");
        }
      } finally {
        setLoading(false);
      }
    }
    if (load) loadData();
  }, [load, id, type]);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, message: err.message || "Erro ao guardar transação" };
      } else {
        return { success: false, message: String(err) };
      }
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

type PropsChangeRole = {
  type: InviteType;
  id: string;
  userId: string;
  load: boolean;
};

export function useDataForChangeRole({ type, id, load = true, userId }: PropsChangeRole) {
  const [roles, setRoles] = useState<SharedRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    type: type,
    user_id: userId,
    subject_id: id,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, user_id: userId }));
  }, [userId]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const requests = [fetch("/api/shared-roles")];
        const [rolesRes] = await Promise.all(requests);
        const rolesData = await rolesRes.json();

        setRoles(rolesData.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message ?? "Erro inesperado");
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }
    if (load) loadData();
  }, [load]);

  const handleSubmit = async (mutate?: () => void): Promise<SubmitResult> => {
    try {
      const url = `/api/change-member-role`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (mutate) mutate();

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      return { success: true, message: result.message };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, message: err.message ?? "Erro inesperado" };
      }
      return { success: false, message: "Erro inesperado" };
    }
  };

  return {
    roles,
    loading,
    handleSubmit,
    error,
    formData,
    setFormData,
  };
}
