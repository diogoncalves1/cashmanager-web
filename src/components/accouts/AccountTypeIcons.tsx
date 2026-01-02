import { Building2Icon, Banknote, Wallet, CreditCard } from "lucide-react";
import { AccountType } from "@/lib/models/account";

const iconMap: Record<AccountType, React.ElementType> = {
  bank_account: Building2Icon,
  cash: Banknote,
  digital_wallet: Wallet,
  credit_card: CreditCard,
};

type AccountTypeIconProps = {
  type: AccountType;
  size?: number;
  className?: string;
};

export function AccountTypeIcon({ type, size = 26, className }: AccountTypeIconProps) {
  const Icon = iconMap[type];

  return <Icon size={size} className={className} />;
}
