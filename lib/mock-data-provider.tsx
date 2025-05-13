"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Address } from "viem";

export type Artist = {
  id: string;
  name: string;
  tokenSymbol: string;
  image: string;
  price: number;
  change24h: number;
  totalInvested: number;
  accountAddress: Address;
  priceHistory: { timestamp: number; price: number }[];
  metrics: {
    [key: string]: {
      name: string;
      value: number;
      history: number[];
      unit?: string;
      icon: string;
    };
  };
};

type MockDataContextType = {
  artists: Artist[];
  getArtist: (id: string) => Artist | undefined;
  buyTokens: (artistId: string, amount: number) => boolean;
  sellTokens: (artistId: string, amount: number) => boolean;
  userBalances: { [key: string]: number };
};

const initialArtists: Artist[] = [
  {
    id: "ibai",
    name: "Ibai Llanos",
    accountAddress: "0x3231E04100A295728F396d26Ad9E4501041A75c2",
    tokenSymbol: "IBAI",
    image: "/ibai.jpg",
    price: 1,
    change24h: 5.2,
    totalInvested: 2500000,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      price: 0.85 + Math.random() * 0.3,
    })),
    metrics: {
      lens: {
        name: "Lens Followers",
        value: 250000,
        history: [240000, 242000, 245000, 248000, 250000],
        icon: "users",
      },
      youtube: {
        name: "YouTube Subscribers",
        value: 10000000,
        history: [9800000, 9850000, 9900000, 9950000, 10000000],
        icon: "youtube",
      },
    },
  },
  {
    id: "gaga",
    name: "Lady Gaga",
    accountAddress: "0x3231E04100A295728F396d26Ad9E4501041A75c2",
    tokenSymbol: "GAGA",
    image: "/Lady Gaga.jpg",
    price: 1,
    change24h: 3.8,
    totalInvested: 4800000,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      price: 0.9 + Math.random() * 0.25,
    })),
    metrics: {
      spotify: {
        name: "Spotify Monthly Listeners",
        value: 45000000,
        history: [44000000, 44200000, 44500000, 44800000, 45000000],
        unit: "M",
        icon: "music",
      },
      instagram: {
        name: "Instagram Followers",
        value: 108000000,
        history: [107000000, 107200000, 107500000, 107800000, 108000000],
        unit: "M",
        icon: "instagram",
      },
    },
  },
  {
    id: "vinci",
    name: "Da Vinci",
    accountAddress: "0x3231E04100A295728F396d26Ad9E4501041A75c2",
    tokenSymbol: "VINCI",
    image: "/Da Vinci.jpg",
    price: 1,
    change24h: -1.2,
    totalInvested: 1800000,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      price: 1.05 - Math.random() * 0.15,
    })),
    metrics: {
      museums: {
        name: "Museum Exhibitions",
        value: 42,
        history: [45, 44, 43, 42, 42],
        icon: "landmark",
      },
      mentions: {
        name: "Academic Citations",
        value: 12500,
        history: [12300, 12350, 12400, 12450, 12500],
        icon: "book-open",
      },
    },
  },
];

const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined
);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [userBalances, setUserBalances] = useState<{ [key: string]: number }>({
    IBAI: 10,
    GAGA: 5,
    VINCI: 3,
  });

  // Function to update metrics and prices
  const updateMetricsAndPrices = () => {
    setArtists((prevArtists) => {
      return prevArtists.map((artist) => {
        // Update each metric with a small random change
        const updatedMetrics = { ...artist.metrics };

        Object.keys(updatedMetrics).forEach((key) => {
          const metric = updatedMetrics[key];
          // Random change between -0.5% and +1.5%
          const changePercent = -0.5 + Math.random() * 2;
          const newValue = Math.round(metric.value * (1 + changePercent / 100));

          // Update history
          const newHistory = [...metric.history.slice(1), newValue];

          updatedMetrics[key] = {
            ...metric,
            value: newValue,
            history: newHistory,
          };
        });

        // Calculate new price based on metrics growth
        const metricValues = Object.values(updatedMetrics);
        const metricGrowths = metricValues.map((metric) => {
          const oldValue = metric.history[0];
          const newValue = metric.value;
          return newValue / oldValue;
        });

        // Average growth across all metrics
        const avgGrowth =
          metricGrowths.reduce((sum, growth) => sum + growth, 0) /
          metricGrowths.length;

        // New price based on growth
        const newPrice = Math.max(
          0.1,
          artist.price * (0.997 + avgGrowth * 0.003)
        );

        // Calculate 24h change
        const change24h =
          ((newPrice - artist.price) / artist.price) * 100 +
          artist.change24h * 0.95;

        // Update price history
        const newPriceHistory = [...artist.priceHistory];
        if (newPriceHistory.length > 100) {
          newPriceHistory.shift(); // Remove oldest price point if we have more than 100
        }
        newPriceHistory.push({
          timestamp: Date.now(),
          price: Number.parseFloat(newPrice.toFixed(4)),
        });

        return {
          ...artist,
          price: Number.parseFloat(newPrice.toFixed(4)),
          change24h: Number.parseFloat(change24h.toFixed(2)),
          priceHistory: newPriceHistory,
          metrics: updatedMetrics,
        };
      });
    });
  };

  // Update metrics and prices every 5-10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateMetricsAndPrices();
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  const getArtist = (id: string) => {
    return artists.find((artist) => artist.id === id);
  };

  const buyTokens = (artistId: string, amount: number) => {
    const artist = getArtist(artistId);
    if (!artist) return false;

    // Update user balance
    setUserBalances((prev) => ({
      ...prev,
      [artist.tokenSymbol]:
        (prev[artist.tokenSymbol] || 0) + amount / artist.price,
    }));

    // Update total invested
    setArtists((prevArtists) => {
      return prevArtists.map((a) => {
        if (a.id === artistId) {
          return {
            ...a,
            totalInvested: a.totalInvested + amount,
          };
        }
        return a;
      });
    });

    return true;
  };

  const sellTokens = (artistId: string, amount: number) => {
    const artist = getArtist(artistId);
    if (!artist) return false;

    const currentBalance = userBalances[artist.tokenSymbol] || 0;
    if (amount / artist.price > currentBalance) return false;

    // Update user balance
    setUserBalances((prev) => ({
      ...prev,
      [artist.tokenSymbol]: prev[artist.tokenSymbol] - amount / artist.price,
    }));

    return true;
  };

  return (
    <MockDataContext.Provider
      value={{ artists, getArtist, buyTokens, sellTokens, userBalances }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
