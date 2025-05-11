"use client";

import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/50 dark:bg-black/50 sticky top-0 z-10 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Day One" width={32} height={32} />
          <Link
            href="/"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400"
          >
            Day One
          </Link>
        </div>

        {/* <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className={
                isMockMode
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-gray-500"
              }
            >
              Mock Mode
            </span>
            <Switch
              checked={isMockMode}
              onCheckedChange={setIsMockMode}
              disabled={true}
              aria-label="Toggle mock mode"
            />
            <span
              className={
                !isMockMode
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-gray-500"
              }
            >
              Real Mode
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div> */}

        <ConnectKitButton theme="auto" mode="dark" />
      </div>
    </header>
  );
}
