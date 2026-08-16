import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const basePath = process.env.NODE_ENV === "production" ? "/finance-tracker-v2" : "";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Aplikasi pencatatan keuangan pribadi lokal. Catat pemasukan, pengeluaran, anggaran, dan target finansial Anda.",
  manifest: `${basePath}/manifest.json?v=6`,
  icons: {
    icon: `${basePath}/logo.png?v=6`,
    shortcut: `${basePath}/logo.png?v=6`,
    apple: [
      { url: `${basePath}/apple-touch-icon.png?v=6`, sizes: "180x180", type: "image/png" },
      { url: `${basePath}/logo.png?v=6`, sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Finance Tracker",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-touch-icon.png?v=6`} />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href={`${basePath}/apple-touch-icon.png?v=6`} />
        <link rel="apple-touch-icon" sizes="152x152" href={`${basePath}/apple-touch-icon.png?v=6`} />
        <link rel="apple-touch-icon" sizes="167x167" href={`${basePath}/apple-touch-icon.png?v=6`} />
        <link rel="icon" type="image/png" sizes="512x512" href={`${basePath}/logo.png?v=6`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Finance Tracker" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
