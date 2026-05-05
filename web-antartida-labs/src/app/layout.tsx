import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Antartida Labs | Inteligencia Artificial del Sur",
  description: "Agentes de IA empaquetados como servicio (Agent As A Service). Entregamos agentes de IA productivos 'llave en mano'.",
  openGraph: {
    title: "Antartida Labs",
    description: "Inteligencia Artificial del Sur. Agentes de IA empaquetados como servicio.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://antartidalabs.com",
    siteName: "Antartida Labs",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antartida Labs | Inteligencia Artificial del Sur",
    description: "Agentes de IA empaquetados como servicio (Agent As A Service).",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
