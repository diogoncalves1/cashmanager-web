import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("COOKIES");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function CookiePolicyPage() {
  const t = useTranslations("COOKIES");

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
        <p className="text-muted-foreground leading-relaxed mt-4">{t("SECTION_1_TEXT_2")}</p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{t("SECTION_2_TITLE")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_TEXT")}</p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_2_1_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_1_TEXT")}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_COOKIE_NAME")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_PURPOSE")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_DURATION")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ESSENTIAL_COOKIE_1_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ESSENTIAL_COOKIE_1_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ESSENTIAL_COOKIE_1_DURATION")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ESSENTIAL_COOKIE_2_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ESSENTIAL_COOKIE_2_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ESSENTIAL_COOKIE_2_DURATION")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ESSENTIAL_COOKIE_3_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ESSENTIAL_COOKIE_3_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ESSENTIAL_COOKIE_3_DURATION")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_2_2_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_2_TEXT")}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_COOKIE_NAME")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_PROVIDER")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_PURPOSE")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_DURATION")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_1_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_1_PROVIDER")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_1_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_1_DURATION")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_2_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_2_PROVIDER")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_2_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("ANALYTICS_COOKIE_2_DURATION")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ANALYTICS_COOKIE_3_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ANALYTICS_COOKIE_3_PROVIDER")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ANALYTICS_COOKIE_3_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("ANALYTICS_COOKIE_3_DURATION")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_2_3_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_3_TEXT")}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_COOKIE_NAME")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_PURPOSE")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {t("TABLE_DURATION")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("FUNCTIONAL_COOKIE_1_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("FUNCTIONAL_COOKIE_1_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("FUNCTIONAL_COOKIE_1_DURATION")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("FUNCTIONAL_COOKIE_2_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("FUNCTIONAL_COOKIE_2_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  {t("FUNCTIONAL_COOKIE_2_DURATION")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("FUNCTIONAL_COOKIE_3_NAME")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("FUNCTIONAL_COOKIE_3_PURPOSE")}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t("FUNCTIONAL_COOKIE_3_DURATION")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">{t("SECTION_2_4_TITLE")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("SECTION_2_4_TEXT")}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  Cookie Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  _fbp
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  Facebook
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  Advertising and retargeting
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  3 months
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-muted-foreground">_gcl_au</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">Google Ads</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">Conversion tracking</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">3 months</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">3. Third-Party Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          In addition to our own cookies, we may also use various third-party cookies to report
          usage statistics of the services and deliver advertisements on and through the services.
          These third parties may include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Google Analytics:</strong> Web analytics service
            that tracks and reports website traffic
          </li>
          <li>
            <strong className="text-foreground">Vercel Analytics:</strong> Performance monitoring
            and analytics
          </li>
          <li>
            <strong className="text-foreground">Stripe:</strong> Payment processing (for premium
            features)
          </li>
          <li>
            <strong className="text-foreground">Intercom:</strong> Customer support and messaging
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          4. How to Manage Cookies
        </h2>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.1 Browser Settings</h3>
        <p className="text-muted-foreground leading-relaxed">
          Most web browsers allow you to control cookies through their settings preferences.
          However, if you limit the ability of websites to set cookies, you may impact your overall
          user experience. Below are links to cookie management instructions for popular browsers:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.2 Cookie Consent Tool</h3>
        <p className="text-muted-foreground leading-relaxed">
          When you first visit our website, you will be presented with a cookie consent banner that
          allows you to accept or reject non-essential cookies. You can change your preferences at
          any time by clicking on the &quot;Cookie Settings&quot; link in the footer of our website.
        </p>

        <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.3 Opt-Out Links</h3>
        <p className="text-muted-foreground leading-relaxed">
          You can also opt out of certain third-party cookies using the following links:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics Opt-Out
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/help/568137493302217"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Facebook Ad Preferences
            </a>
          </li>
          <li>
            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Network Advertising Initiative Opt-Out
            </a>
          </li>
          <li>
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Digital Advertising Alliance Opt-Out
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          5. Similar Technologies
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          In addition to cookies, we may use other similar technologies:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Web Beacons:</strong> Small graphic images (also
            known as &quot;pixel tags&quot;) that may be included on our services and emails to
            measure engagement.
          </li>
          <li>
            <strong className="text-foreground">Local Storage:</strong> Technology that allows a
            website to store and retrieve data on a user&apos;s device, similar to cookies but with
            greater capacity.
          </li>
          <li>
            <strong className="text-foreground">Session Storage:</strong> Similar to local storage
            but data is cleared when the browser session ends.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">6. Do Not Track</h2>
        <p className="text-muted-foreground leading-relaxed">
          Some browsers have a &quot;Do Not Track&quot; feature that signals to websites that you do
          not want to have your online activity tracked. Our services currently do not respond to Do
          Not Track signals. However, you can manage your cookie preferences using the methods
          described above.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
          7. Updates to This Policy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Cookie Policy from time to time to reflect changes in the cookies we
          use or for other operational, legal, or regulatory reasons. Please revisit this Cookie
          Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">8. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about our use of cookies or other technologies, please contact
          us at:
        </p>
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-foreground font-medium">Privacy Team</p>
          <p className="text-muted-foreground mt-1">Email: privacy@cashmanager.pt</p>
        </div>
      </section>
    </article>
  );
}
