import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { HeroUIProvider } from "@heroui/system";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className}  dark:bg-gray-900`}>
        <HeroUIProvider>
          <ThemeProvider>
            <SidebarProvider>
              <AuthProvider>{children}</AuthProvider>
            </SidebarProvider>
          </ThemeProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
