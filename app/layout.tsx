import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FormPilot — Forms that actually tell you something",
  description:
    "Build beautiful forms, collect responses, and let AI summarise what your respondents are really saying. Trusted by 50+ student orgs and startups.",
  keywords: ["form builder", "AI summaries", "surveys", "feedback", "analytics"],
  openGraph: {
    title: "FormPilot",
    description: "Forms that actually tell you something.",
    siteName: "FormPilot",
    type: "website",
  },
};

/**
 * Inline script to prevent flash of wrong theme (FOUC).
 * Runs before React hydration — reads localStorage and applies .dark class instantly.
 */
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('fp-theme');
      var isDark = stored === 'dark' ||
        (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
        (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}