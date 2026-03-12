"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AuthSubmitButton from "./AuthSubmitButton";
import { useToast } from "@/hooks/useToast";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [isRegisting, setIsRegisting] = useState(false);
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkError, setCheckError] = useState("");
  const [error, setError] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const router = useRouter();
  const t = useTranslations("SIGN_UP");
  const { toast } = useToast();

  useEffect(() => {
    if (!username) return;

    const timeout = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timeout);

    async function checkUsername() {
      try {
        const res = await fetch(`/api/auth/check-username?username=${username}`);
        const data = await res.json();

        setErrorUsername(data.data.exists ? t("USERNAME_ALREADY_REGISTED") : "");
      } catch (err) {
        console.error(err);
      }
    }
  }, [username, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isChecked) {
        setCheckError(t("ACCEPT_TERMS"));
        return;
      }

      setIsRegisting(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: fname + " " + lname,
          username: username,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(t("ERROR_ON_SIGNUP"));
        return;
      }

      toast({ description: t("SIGN_IN_SUCCESS") });

      await router.push("/signin");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegisting(false);
    }
  };

  useEffect(() => {
    if (isChecked) setCheckError("");
  }, [isChecked]);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("SIGN_UP")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("SIGN_UP_TEXT")}</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- Username --> */}
                <div>
                  <Label>
                    {t("USERNAME")}
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase());
                    }}
                    placeholder={t("USERNAME_PLACEHOLDER")}
                    hint={errorUsername}
                    error={errorUsername != ""}
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      {t("FIRST_NAME")}
                      <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      onChange={(e) => {
                        setFName(e.target.value);
                      }}
                      placeholder={t("FIRST_NAME_PLACEHOLDER")}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      {t("LAST_NAME")}
                      <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      onChange={(e) => {
                        setLName(e.target.value);
                      }}
                      placeholder={t("LAST_NAME_PLACEHOLDER")}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
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
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    {t("PASSWORD")}
                    <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder={t("PASSWORD_PLACEHOLDER")}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      minlength={8}
                      type={showPassword ? "text" : "password"}
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
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    {t("BY_CREATING_ACCOUNT") + " "}
                    <Link href={"/terms"} className="text-gray-800 dark:text-white/90">
                      {t("TERMS_AND_CONDITIONS")},
                    </Link>{" "}
                    {t("AND_OUR")}{" "}
                    <Link href={"/privacy"} className="text-gray-800 dark:text-white">
                      {t("PRIVACY_POLICY")}
                    </Link>
                  </p>
                </div>
                <p className="text-xs text-error-500">{checkError}</p>
                {/* <!-- Button --> */}
                <div>
                  <AuthSubmitButton>
                    {isRegisting ? (
                      <div className="flex justify-center space-x-2">
                        <span className="size-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="size-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                        <span className="size-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                      </div>
                    ) : (
                      t("SIGN_UP")
                    )}
                  </AuthSubmitButton>
                </div>
              </div>
              <p className="text-xs text-error-500 mt-4">{error}</p>
            </form>

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
        </div>
      </div>
    </div>
  );
}
