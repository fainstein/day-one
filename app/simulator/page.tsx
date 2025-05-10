"use client";
import { LensFluenceSimulator } from "@/components/lensfluence-simulator";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
            Day One Simulator
          </h1>
          <p className="text-center text-gray-400 mb-2">
            Invest in Tomorrow's Stars Today
          </p>
          <div className="max-w-3xl mx-auto text-center mb-8 text-gray-300 text-sm">
            <p>
              Day One lets you invest in emerging artists, athletes, and
              cultural icons before the world sees their value. Buy their token,
              support them early, and earn when their success becomes real.
              Because if you saw it on Day One — you deserve a piece when they
              won.
            </p>
            <p className="mt-4 text-gray-400">
              Powered by Lens Protocol. Built for people with cultural
              conviction.
            </p>
          </div>
          <LensFluenceSimulator />
        </div>
      </main>
    </ThemeProvider>
  );
}
