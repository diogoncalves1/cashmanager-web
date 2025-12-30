import { Account } from "@/lib/models/account";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AccountTypeIcon } from "@/components/accouts/AccountTypeIcons";
import { memo } from "react";

function AccountBalance({ account }: { account: Account }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-[1px] shadow-xl
  bg-[radial-gradient(120%_120%_at_100%_0%,rgba(56,189,248,0.35),transparent_60%),
     linear-gradient(135deg,#4f46e5,#2563eb,#0284c7)]
"
    >
      <div className="relative rounded-3xl bg-[linear-gradient(135deg,#4338ca,#1d4ed8,#0369a1)] p-8 text-white">
        {/* soft glass overlay */}
        <div className="pointer-events-none absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

        <div className="relative">
          <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-10">
            <AccountTypeIcon type={account.type} size={180} />
          </div>

          {/* Header */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-white/70">Saldo atual</p>
            <p className="text-4xl font-extrabold tracking-tight">
              {account.balanceFormatedWithoutSymbol}
            </p>
          </div>

          {/* Metrics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {/* Revenues */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-300">
                <TrendingUp className="size-4" />
                <span className="text-xs uppercase tracking-wide">Entradas</span>
              </div>
              <p className="text-lg font-semibold">+ {account.totalRevenues}</p>
            </div>

            {/* Expenses */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-300">
                <TrendingDown className="size-4" />
                <span className="text-xs uppercase tracking-wide">Saídas</span>
              </div>
              <p className="text-lg font-semibold">- {account.totalExpenses}</p>
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wide text-white/70">Moeda</span>
              <p className="text-lg font-semibold">{account.currencyCode}</p>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wide text-white/70">Tipo</span>
              <p className="text-lg font-semibold">{account.typeTranslated}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AccountBalance);
