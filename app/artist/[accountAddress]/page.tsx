"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import MetricCard from "@/components/metric-card";
import TradingForm from "@/components/trading-form";
import PriceLogic from "@/components/price-logic";
import PriceChart from "@/components/price-chart";
import { useParams } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Role } from "@lens-protocol/react";
import { useSessionStore } from "@/stores/session-store";
import CreateAccountModal from "@/components/create-account-modal";
import ArtistDetailControls from "@/components/artist-detail-controls";
import useLensAccounts, { LensAccount } from "@/hooks/useLensAccounts";
import { formatAddress } from "@/lib/utils";
import useArtist from "@/hooks/useArtist";
import { Address, erc20Abi, formatUnits } from "viem";

export default function ArtistPage() {
  const params = useParams<{ accountAddress: string }>();

  const { address } = useAccount();
  const { accounts } = useLensAccounts(address);
  const { authenticate, accountAddress } = useSessionStore();

  const { session } = useSessionStore();
  const isAuthenticated = !!session;

  const { artist } = useArtist(params.accountAddress as Address);
  const { data: balance } = useReadContract({
    address: artist?.tokenAddress as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [accountAddress || "0x"],
  });

  console.log("Smart Account Address:", accountAddress);
  console.log("Smart Account Artist Token Balance:", balance);

  const [activeTab, setActiveTab] = useState("overview");

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);

  // Update artist data when it changes
  const handleAuthenticate = async (account: LensAccount) => {
    if (!address) {
      throw new Error("No address found");
    }
    if (account.role === Role.OnboardingUser) {
      await authenticate(address, address, Role.OnboardingUser);
      setIsCreateAccountModalOpen(true);
    } else {
      // TODO: Handle other roles
      await authenticate(
        account.account.owner,
        account.account.address,
        account.role
      );
    }
  };

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-xl text-gray-400">Artist not found</p>
      </div>
    );
  }

  const userTokenBalance = balance || BigInt(0);

  return (
    <div className="space-y-8">
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 relative aspect-square rounded-xl overflow-hidden">
          <Image
            src={artist.image || "/placeholder.svg"}
            alt={artist.name}
            fill
            className="object-cover rounded-full border border-white/10 shadow-lg backdrop-blur-md"
          />
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{artist.name}</h1>
              <ArtistDetailControls artist={artist} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500 dark:text-gray-400">Token:</span>
              <span className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium">
                ${artist.tokenSymbol}
              </span>
            </div>
          </div>

          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Current Price
                  </p>
                  <p className="text-3xl font-bold font-mono">
                    ${artist.price}
                  </p>
                </div>
                <div
                  className={`flex items-center text-lg font-medium ${
                    artist.change24h && artist.change24h >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {artist.change24h && artist.change24h >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-1" />
                  )}
                  {artist.change24h && artist.change24h >= 0 ? "+" : ""}
                  {artist.change24h}% (24h)
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 bg-gray-100 dark:bg-gray-900">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="buy">Buy / Sell</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              {/* <div> */}
                {/* <h2 className="text-xl font-bold mb-4 flex items-center"> */}
                  {/* <LineChart className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" /> */}
                  {/* Price History */}
                {/* </h2> */}
                {/* <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 h-80"> */}
                  {/* <CardContent className="p-4 h-full"> */}
                    {/* <PriceChart priceHistory={artist.priceHistory ?? []} /> */}
                  {/* </CardContent> */}
                {/* </Card> */}
              {/* </div> */}

              <div>
                <h2 className="text-xl font-bold mb-4">Live Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artist.metrics &&
                    Object.entries(artist.metrics).map(([key, metric]) => (
                      <MetricCard
                        key={key}
                        name={metric.name}
                        value={metric.value}
                        history={metric.history}
                        unit={metric.unit}
                        icon={metric.icon}
                      />
                    ))}
                </div>
              </div>

              <PriceLogic />
            </TabsContent>

            <TabsContent value="buy" className="pt-4">
              {isAuthenticated ? (
                <div className="space-y-6">
                  <TradingForm
                    artistAccountAddress={artist.accountAddress}
                    tokenSymbol={artist.tokenSymbol}
                    price={artist.price ?? 0}
                    userTokenBalance={userTokenBalance}
                  />

                  <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50">
                    <CardHeader>
                      <CardTitle>Your Balance</CardTitle>
                      <CardDescription>
                        Your current token holdings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">${artist.tokenSymbol}</span>
                        <span className="text-lg font-mono">
                          {Number(formatUnits(userTokenBalance, 18)).toFixed(4)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Value: $
                        {(
                          Number(formatUnits(userTokenBalance, 18)) *
                          (artist.price ?? 0)
                        ).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                    Authenticate to buy or sell tokens
                  </p>
                  {accounts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No accounts found. Please create an account first.
                      </p>
                      <Button
                        onClick={() =>
                          handleAuthenticate({
                            account: null,
                            role: Role.OnboardingUser,
                          } as unknown as LensAccount)
                        }
                      >
                        Create Account
                      </Button>
                    </div>
                  )}
                  {accounts.map((account) => (
                    <div
                      className="flex items-center gap-2 justify-evenly w-full"
                      key={account.account.address}
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatAddress(account.account.address)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {account.account.username?.localName || "#"}
                      </p>
                      <Button onClick={() => handleAuthenticate(account)}>
                        Authenticate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
