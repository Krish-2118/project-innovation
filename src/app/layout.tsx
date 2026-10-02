import type { Metadata, Viewport } from "next";
import { Exo_2, Lora, Outfit, Inter, Geist, Cinzel, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INNOVISION | The Celestial Odyssey",
  description: "Celestial 3D Web Experience",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", exo2.variable, lora.variable, outfit.variable, inter.variable, cinzel.variable, cormorant.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className={`${lora.className} min-h-full flex flex-col bg-[#020712] text-white`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
