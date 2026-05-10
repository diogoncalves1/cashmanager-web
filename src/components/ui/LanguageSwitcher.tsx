"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import PortugalFlag from "../../../public/images/flags/pt.svg";
import USFlag from "../../../public/images/flags/us.svg";
import { useRouter } from "next/navigation";

type Language = "en" | "pt";

interface LanguageOption {
  code: Language;
  label: string;
  flag: React.ReactNode;
  nativeLabel: string;
}

interface LanguageSwitcherProps {
  variant?: "default" | "minimal" | "compact";
  className?: string;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export function LanguageSwitcher({ variant = "default", className }: LanguageSwitcherProps) {
  const languages: LanguageOption[] = [
    {
      code: "pt",
      label: "Português",
      flag: <PortugalFlag width={24} height={24} />,
      nativeLabel: "PT",
    },
    { code: "en", label: "English", flag: <USFlag width={24} height={24} />, nativeLabel: "EN" },
    //   { code: "fr", label: "French", flag: <FRFlag width={24} height={24} />, nativeLabel: "FR" },
  ];

  const [selected, setSelected] = useState<Language>("pt"); // fallback

  useEffect(() => {
    const cookieLang = getCookie("NEXT_LOCALE") as Language;
    if (cookieLang) setSelected(cookieLang);
  }, []);

  const router = useRouter();

  const currentLang = languages.find((l) => l.code === selected) || languages[0];

  const handleSelect = (code: Language) => {
    setSelected(code);
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  };

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
              className
            )}
          >
            {currentLang.flag}
            <span className="text-xs font-medium">{currentLang.nativeLabel}</span>
            <ChevronDown className="size-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="flex items-center justify-between gap-3 hover:text-black"
            >
              <div className="flex items-center gap-2">
                {lang.flag}
                <span className="text-sm">{lang.label}</span>
              </div>
              {selected === lang.code && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8 text-muted-foreground hover:text-foreground", className)}
            aria-label="Select language"
          >
            <Globe className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="flex items-center justify-between gap-3 hover:text-black"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.label}</span>
                </div>
              </div>
              {selected === lang.code && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-2 border-border/60 bg-transparent px-3 text-muted-foreground hover:bg-accent hover:text-foreground",
            className
          )}
        >
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span className="text-sm font-medium">{currentLang.nativeLabel}</span>
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="flex items-center justify-between gap-4 py-2 hover:text-black"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">{lang.flag}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</span>
              </div>
            </div>
            {selected === lang.code && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
