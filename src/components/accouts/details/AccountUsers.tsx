import { Account } from "@/lib/models/account";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowRight } from "lucide-react";
import { UserTransactionsModal } from "@/components/ui/modal/UserTransactionsModal";

type AccountUsersProps = {
  account?: Account;
};

function AccountUsers({ account }: AccountUsersProps) {
  if (!account) return <></>;

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4 flex justify-between">
        <h2 className="text-lg font-semibold">Utilizadores</h2>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white">Adicionar</button>
      </div>

      <div className="divide-y">
        {account.users?.map((u, i) => (
          <div key={i} className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 transition-transform hover:scale-110">
                {u.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.sharedRole?.name}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setSelectedUser({
                  id: u.id,
                  name: u.name,
                })
              }
              className="
                        group flex items-center gap-2
                        rounded-full
                        bg-blue-100 px-4 py-2
                        text-sm font-medium text-blue-700
                        transition-all
                        hover:bg-blue-200
                        hover:shadow-sm
                        focus:outline-none
                      "
            >
              <Activity className="size-4 text-blue-600" />
              <span>Transações</span>
              <ArrowRight className="size-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        ))}
        <UserTransactionsModal
          open={!!selectedUser}
          userId={selectedUser?.id}
          accountId={account.id}
          userName={selectedUser?.name}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  );
}

export default memo(AccountUsers);
