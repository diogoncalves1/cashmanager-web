"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AccountType } from "@/models/account";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Filters {
  search?: string;
  type: AccountType | "all";
  active: "all" | "active" | "inactive";
  sort?: "name" | "balance" | "type";
  sortOrder: "asc" | "desc";
}

interface AccountFiltersProps {
  filters: Filters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function AccountFilters({ filters, setFilters }: AccountFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search accounts..."
          value={filters?.search || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="pl-9 bg-white"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Type</Label>
        <Select
          value={filters?.type}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, type: value as AccountType | "all" }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bank_account">Bank Account</SelectItem>
            <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select
          value={filters?.active}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, active: value as "all" | "active" | "inactive" }))
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Sort by</Label>
        <Select
          value={filters?.sort}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sort: value as "name" | "balance" | "type" }))
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="balance">Balance</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Order</Label>
        <Select
          value={filters?.sortOrder}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sortOrder: value as "asc" | "desc" }))
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Ascending" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
