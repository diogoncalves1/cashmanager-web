"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function EmailVerified() {
  const t = useTranslations("EMAIL_VERIFIED");
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    handleVerify();
  }, []);

  const handleVerify = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setEmailVerified(false);
        return;
      }

      setEmailVerified(true);
    } catch (err) {
      setEmailVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-700 dark:text-gray-400">{t("VERIFYING_EMAIL")}...</p>
      );
    }

    if (emailVerified) {
      return (
        <div>
          <p className="text-green-600 dark:text-green-400 font-medium mb-4">
            {t("EMAIL_VERIFIED_SUCCESS")}
          </p>
          <Link
            href="/signin"
            className="inline-block text-center w-full px-6 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            {t("GO_TO_LOGIN")}
          </Link>
        </div>
      );
    }

    return (
      <div>
        <p className="text-red-600 dark:text-red-400 font-medium mb-4">
          {t("EMAIL_VERIFIED_ERROR")}
        </p>
        <Link
          href="/signin"
          className="inline-block text-center w-full px-6 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          {t("GO_TO_LOGIN")}
        </Link>
        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            {t("ALREADY_HAVE_AN_ACCOUNT")}
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {" " + t("SIGN_IN")}
            </Link>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-1 sm:mb-2">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t("VERIFY_EMAIL")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("VERIFY_EMAIL_TEXT")}</p>
        </div>

        <div className="mt-2 w-full">{renderContent()}</div>
      </div>
    </div>
  );
}
