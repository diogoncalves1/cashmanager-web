"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";

export const ChangePassword = () => {
  const { toast } = useToast();
  const t = useTranslations("CHANGE_PASSWORD");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = t("CURRENT_PASSWORD_REQUIRED");
    if (!newPassword) {
      newErrors.newPassword = t("NEW_PASSWORD_IS_REQUIRED");
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
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors({
          trying:
            res.status == 403 ? t("CURRENT_PASSWORD_INCORRECT") : t("ERROR_TRYING_UPDATE_PASSWORD"),
        });
        return;
      }

      toast({
        title: t("PASSWORD_UPDATED"),
        description: t("PASSWORD_UPDATED_DESCRIPTION"),
      });
    } catch (err) {
      setErrors({ trying: t("ERROR_TRYING_UPDATE_PASSWORD") });
      console.error(err);
    }
    setIsSaving(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{t("CHANGE_PASSWORD")}</CardTitle>
            <CardDescription>{t("PASSWORD_INSTRUCTION")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("CURRENT_PASSWORD")}</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrors((prev) => {
                    const n = { ...prev };
                    delete n.currentPassword;
                    return n;
                  });
                }}
                className={errors.currentPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                <span className="sr-only">
                  {showCurrent ? t("HIDE") : t("SHOW")}{" "}
                  <span className="lowercase">{t("PASSWORD")}</span>
                </span>
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("NEW_PASSWORD")}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => {
                    const n = { ...prev };
                    delete n.newPassword;
                    return n;
                  });
                }}
                className={errors.newPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                <span className="sr-only">
                  {showNew ? t("HIDE") : t("SHOW")}{" "}
                  <span className="lowercase">{t("PASSWORD")}</span>
                </span>
              </Button>
            </div>
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
            <p className="text-xs text-muted-foreground">{t("PASSWORD_MIN_LENGTH_HINT")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("CONFIRM_NEW_PASSWORD")}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => {
                    const n = { ...prev };
                    delete n.confirmPassword;
                    return n;
                  });
                }}
                className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                <span className="sr-only">
                  {showConfirm ? t("HIDE") : t("SHOW")}{" "}
                  <span className="lowercase">{t("PASSWORD")}</span>
                </span>
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.trying && <p className="text-xs text-destructive">{errors.trying}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/settings">{t("CANCEL")}</Link>
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Lock className="size-4" />
              )}
              {isSaving ? t("UPDATING") : t("UPDATE_PASSWORD")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
