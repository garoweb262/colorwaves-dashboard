import { Metadata } from "next";
import { baseURL } from "@/app/resources/config";
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AmalTech CMS",
    template: `%s | AmalTech CMS`,
  },
  description: "Modern content management system for Amal Technologies",
  keywords: ["CMS", "Content Management", "AmalTech", "Technology"],
  authors: [{ name: "AmalTech" }],
  creator: "AmalTech",
  publisher: "AmalTech",
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
    locale: "en",
    url: baseURL,
    title: "AmalTech CMS",
    description: "Modern content management system for Amal Technologies",
    siteName: "AmalTech CMS",
    images: [
      {
        url: `${baseURL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "AmalTech CMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AmalTech CMS",
    description: "Modern content management system for Amal Technologies",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
