"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Banknote, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Address } from "viem";
import useArtist from "@/hooks/useArtist";

type ArtistCardProps = {
  accountAddress: Address;
};

export default function ArtistCard({ accountAddress }: ArtistCardProps) {
  const { artist, isLoading } = useArtist(accountAddress);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  // Update price when artist price changes
  useEffect(() => {
    if (!artist || !artist.price || !artist.change24h) return;
    const currentPrice = artist.price;
    const oldPrice = artist.change24h;
    setCurrentPrice(currentPrice);
    setPriceChange(currentPrice - oldPrice);
  }, [artist]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  if (isLoading || !artist) return <div>Loading...</div>;

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white">
          ${artist.tokenSymbol}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{artist.name}</h3>
          <div className="flex flex-col items-end">
            <div className="text-lg font-mono font-bold">
              ${artist.price?.toFixed(2)}
              {priceChange !== 0 && (
                <span
                  className={`ml-1 text-xs ${
                    priceChange > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {priceChange > 0 ? "↑" : "↓"}
                </span>
              )}
            </div>
            <div
              className={`text-sm font-medium flex items-center ${
                artist.change24h && artist.change24h >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {artist.change24h && artist.change24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {artist.change24h && artist.change24h >= 0 ? "+" : ""}
              {artist.change24h}%
            </div>
          </div>
        </div>

        <div className="flex items-center mt-3 text-gray-600 dark:text-gray-400">
          <Banknote className="h-4 w-4 mr-1" />
          <span className="text-sm">
            Net Worth:{" "}
            {artist.totalInvested && formatNumber(artist.totalInvested)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
          asChild
        >
          <Link href={`/artist/${accountAddress}`}>
            View Details
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="default"
          className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
          asChild
        >
          <Link href={`/artist/${accountAddress}`}>Buy</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
