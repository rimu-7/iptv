import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Noto_Serif,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { IPTVProvider } from "@/context/iptv-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { ThemeProvider } from "@/components/theme-provider";

const ibmPlexSansHeading = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-serif" });

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPTV - Premium Live Stream Television Player",
  description:
    "Experience modern web-based IPTV. Search, catalog, watch, and pin global live M3U8 streams with high-performance HLS rendering, custom player, and glassmorphic dashboards.",
  openGraph: {
    title: "IPTV Player",
    description:
      "Blazing-fast live television player for M3U8 HLS streaming lists.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        inter.variable,
        "font-sans",
        notoSerif.variable,
        ibmPlexSansHeading.variable,
      )}
    >
      {/* <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IPTVProvider>
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </IPTVProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
