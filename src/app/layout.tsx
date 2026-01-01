import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { HeroUIProvider } from "@heroui/system";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={`${outfit.className}  dark:bg-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <HeroUIProvider>
            <ThemeProvider>
              <SidebarProvider>
                <AuthProvider>{children}</AuthProvider>
              </SidebarProvider>
            </ThemeProvider>
          </HeroUIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
