"use client";

import { use, useState } from "react";
import Button from "../ui/button/Button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { onSendRequest } from "@/services/friends/service";

export default function AddFriend() {
  const [userId, setUsername] = useState("");
  const t = useTranslations("FRIENDS");

  return (
    <div className="flex gap-3">
      <Input
        value={userId}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={t("ADD_BY_ID")}
      />
      <Button
        color="primary"
        onClick={async () => {
          await onSendRequest(userId, t);
        }}
        startIcon={<Plus size={16} />}
        disabled={!userId.trim()}
      >
        {t("SEND")}
      </Button>
    </div>
  );
}
