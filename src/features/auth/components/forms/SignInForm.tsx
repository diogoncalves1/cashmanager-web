"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingToast from "@/components/swal/LoadingToast";
import { useTranslations } from "next-intl";
import { AuthSubmitButton } from "@/features/auth";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("SIGN_IN");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const toast = LoadingToast({ title: t("SIGN_IN_TITLE"), message: t("SIGN_IN_WAIT") });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          remember: isChecked,
        }),
      });

      toast.close();

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(res.status == 403 ? t("EMAIL_NOT_VERIFIED") : t("ERROR_ON_SIGN_IN"));
        return;
      }

      await router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(t("ERROR_ON_SIGN_IN"));
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("SIGN_IN")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("SIGN_IN_TEXT")}</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder={t("EMAIL_PLACEHOLDER")}
                    type="email"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    {t("PASSWORD")} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      defaultValue={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("PASSWORD_PLACEHOLDER")}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      {t("KEEP_ME_LOGGED_IN")}
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    {t("FORGOT_PASSWORD")}
                  </Link>
                </div>

                {error && <p className="text-error-500">{error}</p>}

                <div>
                  <AuthSubmitButton>{t("SIGN_IN")}</AuthSubmitButton>
                </div>
              </div>
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
