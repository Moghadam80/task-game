import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import "./globals.css";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"], display: "swap", variable: "--font-vazirmatn" });

export const metadata: Metadata = {
  title: "کاوشگر بازی‌ها | Lifelands",
  description: "بازی‌های لایف‌لندز را جست‌وجو، فیلتر و مرتب کنید.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function () { try { var saved = localStorage.getItem("lifelands.theme"); var theme = saved === "light" || saved === "dark" ? saved : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); document.documentElement.classList.add(theme); document.documentElement.style.colorScheme = theme; } catch (error) {} })()` }} />
      </head>
      <body className={`${vazirmatn.variable} ${vazirmatn.className} antialiased`}><Providers>{children}</Providers></body>
    </html>
  );
}
