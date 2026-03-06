"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

export function PasswordCard() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const t = useTranslations("SETTINGS");

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("PASSWORD")}</CardTitle>
              <CardDescription>{t("PASSORD_TEXT")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={() => setShowConfirm(true)} className="gap-2">
              <ExternalLink className="size-4" />
              {t("CHANGE_PASSWORD")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("CHANGE_PASSWORD")}</AlertDialogTitle>
            <AlertDialogDescription>{t("CHANGE_PASSWORD_TEXT")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("CANCEL")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/settings/change-password")}>
              {t("CONTINUE")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
