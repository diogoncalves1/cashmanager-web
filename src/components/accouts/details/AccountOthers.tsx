import { Account } from "@/lib/models/account";
import { onChangeStatus, onDeleteAccount } from "@/services/accounts/service";
import { useTranslations } from "next-intl";
import { Dispatch, memo, SetStateAction } from "react";

type AccountOthersProps = {
  account?: Account;
  setAccount: Dispatch<SetStateAction<any>>;
  router: any;
};

function AccountOthers({ account, setAccount, router }: AccountOthersProps) {
  if (!account) return <></>;
  const t = useTranslations("ACCOUNTS");

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold">{t("OTHERS")}</h2>

      <div className="flex justify-between items-center">
        {account.active && account.actions?.edit ? (
          <button
            onClick={async function () {
              const res = await onChangeStatus(account.id, account.active);

              if (res) setAccount({ ...account, active: !account.active });
            }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {t("DISABLE_ACCOUNT")}
          </button>
        ) : (
          <button
            onClick={async function () {
              const res = await onChangeStatus(account.id, account.active);

              if (res) setAccount({ ...account, active: !account.active });
            }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {t("ACTIVATE_ACCOUNT")}
          </button>
        )}
      </div>

      {account.actions?.destroy && (
        <button
          onClick={async function () {
            const res = await onDeleteAccount(account.id);

            res && router.push("/accounts");
          }}
          className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          {t("DELETE_ACCOUNT")}
        </button>
      )}
    </div>
  );
}

export default memo(AccountOthers);
