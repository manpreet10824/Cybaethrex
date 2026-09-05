import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProfileProvider } from "@/components/motion/MotionProfile";
import {
  ThemeProvider,
  THEME_SCRIPT,
} from "@/components/theme/ThemeProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Display face. The logo wordmark is a heavy, wide grotesque, so headlines use
 * a grotesque with the same structural confidence rather than a neutral UI sans.
 */
/**
 * Loaded as the variable font, not as static instances. Naming explicit
 * weights here would ship 500/600/700 as separate files with no `wght` axis,
 * and any font-variation-settings animation would silently do nothing.
 */
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Cybaethrex · Cybersecurity Consulting, AI Risk & GRC";
const DESCRIPTION =
  "Cybaethrex helps organizations identify, manage and reduce security risk across AI, applications, cloud, infrastructure and enterprise technology.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Page-level titles already carry the brand, so they pass through as-is.
    template: "%s",
  },
  description: DESCRIPTION,
  applicationName: "Cybaethrex",
  keywords: [
    "cybersecurity consulting",
    "AI security",
    "AI risk management",
    "penetration testing",
    "VAPT",
    "red teaming",
    "ISO 27001",
    "NIST CSF",
    "security engineering",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Cybaethrex",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Cybaethrex, cybersecurity consulting for a changing technology landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // the pre-paint script stamps data-theme before React hydrates
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {/* resolves the theme before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <ThemeProvider>
          <MotionProfileProvider>
            <div className="grain" aria-hidden />
            <SmoothScroll />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:text-[13px] focus:text-[var(--on-signal)]"
            >
              Skip to content
            </a>
            <Nav />
            <PageTransition>
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </PageTransition>
          </MotionProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
