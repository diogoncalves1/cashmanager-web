import React from "react";
import { LucideIcon } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  tabs: {
    icon: LucideIcon;
    label: string;
    value: string;
  }[];
};

const CustomTabList = ({ tabs }: Props) => {
  return (
    <TabsList className="flex h-12 w-full items-center gap-1 overflow-x-auto rounded-md shadow-md bg-white p-1.5 dark:border-gray-800 dark:bg-gray-900 sm:w-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100 md:px-4"
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default CustomTabList;
