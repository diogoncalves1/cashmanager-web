import { useTranslations } from "next-intl";

export const InvitationContainerLoading = () => {
  const t = useTranslations("INVITE_MEMBER");
  return (
    <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="max-w-6xl mx-auto px-6 py-10  ">
          <main className="container">
            <div className="space-y-8">
              {/* Page header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {t("INVITATIONS")}
                  </h1>
                  <p className="text-muted-foreground mt-1">{t("INVITATIONS_TEXT")}</p>
                </div>
              </div>
              <div className="space-y-8 animate-pulse">
                {/* Summary cards loading */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-muted" />
                  ))}
                </div>

                {/* Tabs loading */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-24 rounded-lg bg-muted" />
                    <div className="h-10 w-24 rounded-lg bg-muted" />
                  </div>

                  {/* List loading */}
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 rounded-xl bg-muted" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
