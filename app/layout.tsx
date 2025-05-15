import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/theme-provider";
import { Web3Provider } from "@/lib/web3-provider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Day One – Trade the Future of Culture",
  description:
    "Invest in the future success of artists by purchasing artist-specific tokens",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Web3Provider>
        <body className={inter.className}>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                  <p>
                    Built with ❤️ for the Lens Hackathon by{" "}
                    <Link
                      className="underline"
                      href="https://github.com/fainstein"
                    >
                      Nico
                    </Link>
                    {" & "}
                    <Link
                      className="underline"
                      href="https://github.com/kevinkuja"
                    >
                      Kevin
                    </Link>
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </Web3Provider>
    </html>
  );
}
