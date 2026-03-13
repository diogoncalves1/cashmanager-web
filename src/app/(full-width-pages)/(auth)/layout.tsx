import GridShape from "@/components/common/GridShape";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

import { ThemeProvider } from "@/context/ThemeContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("AUTH");
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-green-50 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <div className="block mb-4">
                  <Image src="/images/logo/logo-long.png" width={200} height={50} alt="Logo" />
                </div>
                <p className="text-center text-gray-400 dark:text-white/60">{t("SLOGAN")}</p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 block">
            <LanguageSwitcher className="hover:bg-white bg-white" />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
