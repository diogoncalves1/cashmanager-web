import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { HeroUIProvider } from "@heroui/system";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/toaster";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
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

      <body className={`${font.variable} dark:bg-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <HeroUIProvider>
            <ThemeProvider>
              <SidebarProvider>
                {children}
                <Toaster />
              </SidebarProvider>
            </ThemeProvider>
          </HeroUIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
