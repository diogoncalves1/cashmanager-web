import EmailVerified from "@/components/auth/EmailVerified";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("VERIFY_EMAIL");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function SignUp() {
  return <EmailVerified />;
}
