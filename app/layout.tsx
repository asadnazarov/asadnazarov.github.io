import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Unbounded } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Asad Nazarov — AI-архитектор",
  description:
    "Внедрение AI-агентов и автоматизации в бизнес. Персональная консультация с экспертом, который сам разрабатывает решения.",
  openGraph: {
    title: "Asad Nazarov — AI-архитектор",
    description:
      "Внедрение AI-агентов и автоматизации в бизнес. Персональная консультация с экспертом, который сам разрабатывает решения.",
    url: SITE_URL,
    siteName: "Asad Nazarov",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asad Nazarov — AI-архитектор",
    description:
      "Внедрение AI-агентов и автоматизации в бизнес. Персональная консультация с экспертом, который сам разрабатывает решения.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
