"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AuthSubmitButton } from "@/features/auth";
import { useToast } from "@/shared/hooks/useToast";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const t = useTranslations("RESET_PASSWORD");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      });

      toast({
        title: t("EMAIL_SENT"),
      });

      if (!res.ok) {
        setError(t("ERROR_ON_RESET_PASSWORD"));
        return;
      }

      await router.push("/signin");
      router.refresh();
    } catch (err) {
      setError(t("ERROR_ON_RESET_PASSWORD"));
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("RESET_PASSWORD")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("RESET_PASSWORD_TEXT")}</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    {t("EMAIL_LABEL")}
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder={t("EMAIL_PLACEHOLDER")}
                  />
                </div>

                <div>
                  <AuthSubmitButton disabled={isSending}>
                    {isSending ? t("SENDING_EMAIL") : t("RESET")}
                  </AuthSubmitButton>
                </div>
              </div>
              <p className="text-xs text-error-500 mt-4">{error}</p>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                {t("DONT_HAVE_AN_ACCOUNT")} {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t("SIGN_UP")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
