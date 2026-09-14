import type { Metadata } from "next";
import { Spectral, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rishav Raj — AI / Agent Engineer",
  description:
    "AI / Agent Engineer working on production LLM systems and post-training (SFT + GRPO/RLVR). M.Sc. Computer Science, 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${spectral.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}