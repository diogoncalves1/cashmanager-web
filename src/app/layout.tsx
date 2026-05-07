import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { HeroUIProvider } from "@heroui/system";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  subsets: ["latin"],
});

// Importa Geist
const geist = localFont({
  src: [
    {
      path: "fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist",
  display: "swap",
  fallback: ["Geist Fallback", "sans-serif"], // define fallback
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" href="/images/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${outfit.className} ${geist.variable} dark:bg-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <HeroUIProvider>
            <ThemeProvider>
              <SidebarProvider>
                {children} <Toaster />
              </SidebarProvider>
            </ThemeProvider>
          </HeroUIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
