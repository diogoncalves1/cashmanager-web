import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Terms of Service - DebtFlow",
  description: "Read the terms and conditions for using the DebtFlow platform.",
};

export default function TermsOfServicePage() {
  const t = useTranslations("TERMS");
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
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_1_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_2_TITLE")}</h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_2_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_1_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_2_1_ITEM_1")}</li>
          <li>{t("SECTION_2_1_ITEM_2")}</li>
          <li>{t("SECTION_2_1_ITEM_3")}</li>
          <li>{t("SECTION_2_1_ITEM_4")}</li>
        </ul>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_2_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_2_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_3_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_3_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_3_ITEM_1")}</li>
          <li>{t("SECTION_3_ITEM_2")}</li>
          <li>{t("SECTION_3_ITEM_3")}</li>
          <li>{t("SECTION_3_ITEM_4")}</li>
          <li>{t("SECTION_3_ITEM_5")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_4_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_4_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_4_ITEM_1")}</li>
          <li>{t("SECTION_4_ITEM_2")}</li>
          <li>{t("SECTION_4_ITEM_3")}</li>
          <li>{t("SECTION_4_ITEM_4")}</li>
          <li>{t("SECTION_4_ITEM_5")}</li>
          <li>{t("SECTION_4_ITEM_6")}</li>
          <li>{t("SECTION_4_ITEM_7")}</li>
          <li>{t("SECTION_4_ITEM_8")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_5_TITLE")}</h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_5_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_5_1_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_5_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_5_2_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_5_3_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_5_3_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_6_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_6_TEXT")}</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("SECTION_6_ITEM_1")}</li>
          <li>{t("SECTION_6_ITEM_2")}</li>
          <li>{t("SECTION_6_ITEM_3")}</li>
          <li>{t("SECTION_6_ITEM_4")}</li>
          <li>{t("SECTION_6_ITEM_5")}</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_7_TITLE")}</h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_7_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_7_1_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_7_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_7_2_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_7_3_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_7_3_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_8_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_8_TEXT")}</p>
        <p className="text-muted-foreground leading-relaxed mt-4">{t("SECTION_8_TEXT_2")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_9_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_9_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_10_TITLE")}
        </h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_10_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_10_1_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_10_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_10_2_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_10_3_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_10_3_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_11_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_11_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_12_TITLE")}
        </h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_12_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_12_1_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_12_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_12_2_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_12_3_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_12_3_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_13_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_13_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_14_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_14_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_15_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_15_TEXT")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          {t("SECTION_16_TITLE")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_16_TEXT")}</p>
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-foreground font-medium">{t("SECTION_16_TEAM")}</p>
          <p className="text-muted-foreground mt-1">{t("SECTION_16_EMAIL")}</p>
        </div>
      </section>
    </article>
  );
}
