import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Maven_Pro } from "next/font/google";
import { baseURL } from "@/app/resources/config";
import { UserProvider } from "@/contexts/UserContext";
import { LogoutProvider } from "@/contexts/LogoutContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/amal-ui";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  variable: "--font-maven-pro",
});

export const metadata: Metadata = {
  title: {
    default: "ColorWaves Dashboard",
    template: `%s | ColorWaves Dashboard`,
  },
  description: "Modern dashboard and content management system for ColorWaves",
  keywords: ["Dashboard", "Content Management", "ColorWaves", "Design System"],
  authors: [{ name: "ColorWaves" }],
  creator: "ColorWaves",
  publisher: "ColorWaves",
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
    title: "ColorWaves Dashboard",
    description: "Modern dashboard and content management system for ColorWaves",
    siteName: "ColorWaves Dashboard",
    images: [
      {
        url: `${baseURL}/images/about.jpg`,
        width: 1200,
        height: 630,
        alt: "ColorWaves Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorWaves Dashboard",
    description: "Modern dashboard and content management system for ColorWaves",
    images: [`${baseURL}/images/about.jpg`],
    creator: "@colorwaves",
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
      <body className={`${inter.variable} ${mavenPro.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <QueryProvider>
          <UserProvider>
            <LogoutProvider>
              <ToastProvider position="top-right" maxToasts={5}>
                {children}
              </ToastProvider>
            </LogoutProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
