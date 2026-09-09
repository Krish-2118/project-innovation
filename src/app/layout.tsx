import type { Metadata } from "next";
import { Exo_2, Lora, Outfit, Inter } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INNOVISION | The Celestial Odyssey",
  description: "Celestial 3D Web Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exo2.variable} ${lora.variable} ${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className={`${lora.className} min-h-full flex flex-col bg-[#020712] text-white`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
