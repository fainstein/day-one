"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Wallet } from "lucide-react";
import { IS_CONNECTED_MOCK } from "@/app/artist/[id]/page";

const connect = () => {
  console.log("connect");
};

const disconnect = () => {
  console.log("disconnect");
};

const ADDRESS_MOCK = "0x1234567890123456789012345678901234567890";

export default function Header() {
  const isConnected = IS_CONNECTED_MOCK;
  const { theme, toggleTheme } = useTheme();
  const [isMockMode, setIsMockMode] = useState(true);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/50 dark:bg-black/50 sticky top-0 z-10 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400"
        >
          Day One
        </Link>

        <div className="flex items-center gap-6">
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

          {isConnected ? (
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600"
              onClick={disconnect}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {truncateAddress(ADDRESS_MOCK)}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600"
              onClick={connect}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
