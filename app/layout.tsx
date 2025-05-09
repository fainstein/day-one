import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { MockDataProvider } from "@/lib/mock-data-provider";
import { WalletProvider } from "@/lib/wallet-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import { LensProvider } from "@lens-protocol/react";
import { client } from "@/wagmi/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForeTalent – Trade the Future of Culture",
  description:
    "Invest in the future success of artists by purchasing artist-specific tokens",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <MockDataProvider>
            <LensProvider client={client}>
              <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                  {children}
                </main>
                <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
                  <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                    <p>
                      This is a demo for ForeTalent – a cultural trading
                      protocol built for the Lens Hackathon.
                    </p>
                  </div>
                </footer>
              </div>
              <Toaster />
            </LensProvider>
          </MockDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
