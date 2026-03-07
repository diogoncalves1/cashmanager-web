"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

interface ProfileInfoCardProps {
  firstName: string;
  username: string;
  lastName: string;
  email?: string;
  errors: Record<string, string>;
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
}

export function ProfileInfoCard({
  firstName,
  username,
  lastName,
  email,
  errors,
  isLoading,
  onChange,
}: ProfileInfoCardProps) {
  const t = useTranslations("SETTINGS");
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{t("PROFILE_INFORMATION")}</CardTitle>
            <CardDescription>{t("PROFILE_INFORMATION_TEXT")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">
            {t("USERNAME")} <span className="text-destructive">*</span>
          </Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => onChange("username", e.target.value)}
                placeholder={t("USERNAME")}
                aria-invalid={!!errors.username}
                className={
                  errors.username ? "border-destructive focus-visible:ring-destructive/50" : ""
                }
              />
              {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
            </>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              {t("FIRST_NAME")} <span className="text-destructive">*</span>
            </Label>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  placeholder={t("FIRST_NAME_PLACEHOLDER")}
                  aria-invalid={!!errors.firstName}
                  className={
                    errors.firstName ? "border-destructive focus-visible:ring-destructive/50" : ""
                  }
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              {t("LAST_NAME")} <span className="text-destructive">*</span>
            </Label>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  placeholder={t("LAST_NAME_PLACEHOLDER")}
                  aria-invalid={!!errors.lastName}
                  className={
                    errors.lastName ? "border-destructive focus-visible:ring-destructive/50" : ""
                  }
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            {t("EMAIL_ADDRESS")} <span className="text-destructive">*</span>
          </Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder={t("EMAIL_ADDRESS_PLACEHOLDER")}
                aria-invalid={!!errors.email}
                className={
                  errors.email ? "border-destructive focus-visible:ring-destructive/50" : ""
                }
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
