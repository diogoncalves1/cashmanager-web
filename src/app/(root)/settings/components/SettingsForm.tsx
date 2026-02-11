"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RotateCcw, Settings } from "lucide-react";
import { ProfileInfoCard } from "../components/ProfileInfoCard";
import { PasswordCard } from "../components/PasswordCard";
import { PreferencesCard } from "../components/PreferencesCard";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { useRouter } from "next/navigation";

type FormData = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  lang?: "pt" | "en";
  currency_id?: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

const SettingsForm = () => {
  const toast = SwalToast;
  const router = useRouter();
  const t = useTranslations("SETTINGS");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const {
    languages,
    currencies,
    loadingCurrencies,
    loadingLanguages,
    handleSubmit,
    user,
    formData,
    initialData,
    setFormData,
    isLoading,
    setInitialData,
  } = useSettingsForm();

  if (!user) return <></>;

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof FormData];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validate()) {
      toast({
        message: "Please fix the highlighted fields before saving.",
        icon: "error",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    const res = await handleSubmit();

    if (res.success) {
      setInitialData(formData);

      toast({
        //   title: "Settings saved",
        message: res.message ?? "Your account settings have been updated successfully.",
        icon: "success",
      });
      router.refresh();
    } else {
      toast({
        //   title: "Settings saved",
        message: "Your account settings have been updated successfully.",
        icon: "error",
      });
    }
    setIsSaving(false);
  }, [formData, validate, toast]);

  const handleReset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">Account Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className="gap-2 bg-transparent"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      {/* Profile Section */}
      <ProfileInfoCard
        firstName={formData.firstName}
        lastName={formData.lastName}
        email={formData.email}
        errors={errors}
        isLoading={isLoading}
        onChange={handleChange}
      />
      {/* Password Section */}
      <PasswordCard />
      {/* Preferences Section */}
      <PreferencesCard
        language={formData.lang}
        currency={formData.currency_id}
        isLoading={isLoading}
        onChange={handleChange}
        loadingCurrencies={loadingCurrencies}
        loadingLanguages={loadingLanguages}
        languages={languages}
        currencies={currencies}
      />
      {/* Sticky Save Bar - appears when there are unsaved changes */}
      {hasChanges && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset} disabled={isSaving}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Save className="size-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
