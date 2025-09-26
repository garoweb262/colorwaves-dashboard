import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { RouteGuard } from "@/components";
import { Header } from "@/components/Header";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { baseURL } from "@/app/resources/config";
import "../globals.css";
import { BackgroundGridLines } from "@/amal-ui/components/BackgroundGridLines";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Metadata",
  });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: t("author") }],
    creator: t("author"),
    publisher: t("publisher"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: params.locale,
      url: baseURL,
      title: t("title"),
      description: t("description"),
      siteName: t("title"),
      images: [
        {
          url: `${baseURL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseURL}/og-image.jpg`],
      creator: "@amaltech",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={params.locale}>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <RouteGuard>
            <div className="min-h-screen flex flex-col w-screen">
              <Header locale={params.locale} />

              {/* Background Grid Lines - positioned above main content */}
              <BackgroundGridLines />

              {/* Main content with layout wrapper */}
              <main className="flex-1 relative z-10">{children}</main>
            </div>
          </RouteGuard>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
