"use client";

import { useState } from "react";
import { Users, UserPlus, Clock, Ban, Send } from "lucide-react";
import FriendsList from "./FriendsList";
import FriendRequests from "./FriendRequests";
import SentRequests from "./SentRequests";
import BlockedUsers from "./BlockedUsers";
import AddFriend from "./AddFriend";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function SocialTabs() {
  const t = useTranslations("FRIENDS");

  const tabs = [
    { id: "friends", label: t("FRIENDS"), icon: Users },
    { id: "receivedRequests", label: t("RECEIVED_REQUETS"), icon: Clock },
    { id: "sentRequests", label: t("SENT_REQUETS"), icon: Send },
    { id: "blocked", label: t("BLOCKED"), icon: Ban },
  ] as const;

  type TabId = (typeof tabs)[number]["id"];

  const [activeTab, setActiveTab] = useState<TabId>("friends");
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
      <div className="flex bg-gray-100/70 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex-1 flex items-center justify-center gap-2.5
                py-3.5 px-3 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-gray-900 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-800/40"
                }
              `}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="font-medium">{tab.label}</span>

              {!isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gray-300 dark:bg-gray-600 group-hover:w-10 transition-all duration-300 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6">
        <span className="text-2xl">ID: {user?.id}</span>
        <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-800/70">
          <AddFriend />
        </div>

        <div className="transition-opacity duration-200">
          {activeTab === "friends" && <FriendsList />}

          {activeTab === "receivedRequests" && (
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-950/40 rounded-md">
                    <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {t("FRIEND_REQUESTS")}
                  </h3>
                </div>
                <FriendRequests />
              </section>
            </div>
          )}
          {activeTab === "sentRequests" && (
            <section>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-md">
                  <UserPlus size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {t("SENT_REQUESTS")}
                </h3>
              </div>
              <SentRequests />
            </section>
          )}

          {activeTab === "blocked" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 bg-red-100 dark:bg-red-950/40 rounded-md">
                  <Ban size={16} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {t("BLOCKED_USERS")}
                </h3>
              </div>
              <BlockedUsers />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
