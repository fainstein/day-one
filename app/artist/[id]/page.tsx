"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useMockData } from "@/lib/mock-data-provider"
import { useWallet } from "@/lib/wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, TrendingDown, TrendingUp } from "lucide-react"
import MetricCard from "@/components/metric-card"
import TradingForm from "@/components/trading-form"
import PriceLogic from "@/components/price-logic"
import PriceChart from "@/components/price-chart"
import { useToast } from "@/components/ui/use-toast"

export default function ArtistPage({ params }: { params: { id: string } }) {
  const { getArtist, userBalances } = useMockData()
  const { isConnected } = useWallet()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("action") === "buy" ? "buy" : "overview"

  const [artist, setArtist] = useState(getArtist(params.id))
  const [activeTab, setActiveTab] = useState(initialTab)

  // Update artist data when it changes
  useEffect(() => {
    const interval = setInterval(() => {
      setArtist(getArtist(params.id))
    }, 1000)

    return () => clearInterval(interval)
  }, [params.id, getArtist])

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-xl text-gray-400">Artist not found</p>
      </div>
    )
  }

  const userTokenBalance = userBalances[artist.tokenSymbol] || 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 relative aspect-square rounded-xl overflow-hidden">
          <Image src={artist.image || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{artist.name}</h1>
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
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Current Price</p>
                  <p className="text-3xl font-bold font-mono">${artist.price.toFixed(4)}</p>
                </div>
                <div
                  className={`flex items-center text-lg font-medium ${artist.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {artist.change24h >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-1" />
                  )}
                  {artist.change24h >= 0 ? "+" : ""}
                  {artist.change24h}% (24h)
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-gray-100 dark:bg-gray-900">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="buy">Buy / Sell</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Price History
                </h2>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 h-80">
                  <CardContent className="p-4 h-full">
                    <PriceChart priceHistory={artist.priceHistory} />
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Live Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(artist.metrics).map(([key, metric]) => (
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
              {isConnected ? (
                <div className="space-y-6">
                  <TradingForm
                    artistId={artist.id}
                    tokenSymbol={artist.tokenSymbol}
                    price={artist.price}
                    userTokenBalance={userTokenBalance}
                  />

                  <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50">
                    <CardHeader>
                      <CardTitle>Your Balance</CardTitle>
                      <CardDescription>Your current token holdings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">${artist.tokenSymbol}</span>
                        <span className="text-lg font-mono">{userTokenBalance.toFixed(4)}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Value: ${(userTokenBalance * artist.price).toFixed(2)} USDC
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                    Connect your wallet to buy or sell tokens
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
