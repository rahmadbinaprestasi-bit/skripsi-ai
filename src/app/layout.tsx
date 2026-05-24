import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: "skripsiAi - AI Writing Anti-Deteksi",
  description: "Menulis skripsi lebih cepat dengan kecerdasan buatan. 100% aman dari deteksi AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={cn(
          inter.variable,
          plusJakarta.variable,
          "min-h-screen bg-slate-50 text-slate-900 font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}