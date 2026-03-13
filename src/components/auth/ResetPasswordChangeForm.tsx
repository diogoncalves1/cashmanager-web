"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";

export default function ResetPasswordChangeForm() {
  const t = useTranslations("RESET_PASSWORD");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const token = searchParams.get("token") ?? searchParams.get("code");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!token) {
      newErrors.token = t("MISSING_TOKEN");
    }

    if (!newPassword) {
      newErrors.newPassword = t("NEW_PASSWORD_REQUIRED");
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t("NEW_PASSWORD_MIN_LENGTH");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("CONFIRM_PASSWORD_REQUIRED");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("PASSWORDS_DO_NOT_MATCH");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/reset-change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors({ trying: t("ERROR_ON_CHANGE_PASSWORD") });
        return;
      }

      toast({
        title: t("PASSWORD_UPDATED"),
        description: t("PASSWORD_UPDATED_DESCRIPTION"),
      });

      router.push("/signin");
    } catch (err) {
      setErrors({ trying: t("ERROR_ON_CHANGE_PASSWORD") });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("SET_NEW_PASSWORD")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("SET_NEW_PASSWORD_TEXT")}</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <Label>{t("NEW_PASSWORD")}</Label>
                  <Input
                    type="password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.newPassword;
                        return next;
                      });
                    }}
                    placeholder={t("NEW_PASSWORD_PLACEHOLDER")}
                  />
                  {errors.newPassword && (
                    <p className="mt-2 text-xs text-destructive">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <Label>{t("CONFIRM_NEW_PASSWORD")}</Label>

                  <Input
                    type="password"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.confirmPassword;
                        return next;
                      });
                    }}
                    placeholder={t("CONFIRM_NEW_PASSWORD_PLACEHOLDER")}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                {errors.trying && <p className="text-xs text-destructive">{errors.trying}</p>}
                {errors.token && <p className="text-xs text-destructive">{errors.token}</p>}

                <div>
                  <AuthSubmitButton disabled={isSaving}>
                    {isSaving ? t("UPDATING") : t("UPDATE_PASSWORD")}
                  </AuthSubmitButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
