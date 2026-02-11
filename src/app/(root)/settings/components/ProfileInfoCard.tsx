"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Skeleton from "@/components/ui/skeleton/Skeleton";

interface ProfileInfoCardProps {
  firstName: string;
  lastName: string;
  email?: string;
  errors: Record<string, string>;
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
}

export function ProfileInfoCard({
  firstName,
  lastName,
  email,
  errors,
  isLoading,
  onChange,
}: ProfileInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  placeholder="John"
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
              Last Name <span className="text-destructive">*</span>
            </Label>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  placeholder="Doe"
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
            Email Address <span className="text-destructive">*</span>
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
                placeholder="john.doe@example.com"
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
