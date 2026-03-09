import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PRIVACY");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function PrivacyPolicyPage() {
  const t = useTranslations("PRIVACY");

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <header className="not-prose mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("HEADING")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("LAST_UPDATED")}</p>
      </header>

      <section className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">{t("INTRO")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_1_TITLE")}</h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_1_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_1_1_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_1_1_ITEM_1")}</li>
          <li>{t("SECTION_1_1_ITEM_2")}</li>
          <li>{t("SECTION_1_1_ITEM_3")}</li>
          <li>{t("SECTION_1_1_ITEM_4")}</li>
        </ul>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_1_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_1_2_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_1_2_ITEM_1")}</li>
          <li>{t("SECTION_1_2_ITEM_2")}</li>
          <li>{t("SECTION_1_2_ITEM_3")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_2_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_2_ITEM_1")}</li>
          <li>{t("SECTION_2_ITEM_2")}</li>
          <li>{t("SECTION_2_ITEM_3")}</li>
          <li>{t("SECTION_2_ITEM_4")}</li>
          <li>{t("SECTION_2_ITEM_5")}</li>
          <li>{t("SECTION_2_ITEM_6")}</li>
          <li>{t("SECTION_2_ITEM_7")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_3_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_3_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_3_ITEM_1")}</li>
          <li>{t("SECTION_3_ITEM_2")}</li>
          <li>{t("SECTION_3_ITEM_3")}</li>
          <li>{t("SECTION_3_ITEM_4")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_4_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_4_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_4_ITEM_1")}</li>
          <li>{t("SECTION_4_ITEM_2")}</li>
          <li>{t("SECTION_4_ITEM_3")}</li>
          <li>{t("SECTION_4_ITEM_4")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_5_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_5_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_6_TITLE")}</h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_6_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_6_1_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_6_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_6_2_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_6_3_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_6_3_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_6_4_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_6_4_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_6_4_ITEM_1")}</li>
          <li>{t("SECTION_6_4_ITEM_2")}</li>
          <li>{t("SECTION_6_4_ITEM_3")}</li>
          <li>{t("SECTION_6_4_ITEM_4")}</li>
        </ul>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_6_5_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_6_5_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_6_5_ITEM_1")}</li>
          <li>{t("SECTION_6_5_ITEM_2")}</li>
          <li>{t("SECTION_6_5_ITEM_3")}</li>
          <li>{t("SECTION_6_5_ITEM_4")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_7_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("SECTION_7_TEXT")}{" "}
          <a href="/cookies" className="text-primary hover:underline">
            {t("COOKIE_POLICY_LINK")}
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_8_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_8_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_9_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_9_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_10_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_10_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_11_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_11_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_12_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_12_TEXT")}</p>
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-foreground font-medium">{t("SECTION_12_TEAM")}</p>
          <p className="text-muted-foreground mt-1">{t("SECTION_12_EMAIL")}</p>
          <p className="text-muted-foreground">{t("SECTION_12_ADDRESS")}</p>
        </div>
      </section>
    </article>
  );
}
